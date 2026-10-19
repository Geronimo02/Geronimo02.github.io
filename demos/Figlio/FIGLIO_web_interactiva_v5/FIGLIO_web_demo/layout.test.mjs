import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const profile = await mkdtemp(join(tmpdir(), "figlio-layout-"));
const port = 19347;
const browser = spawn(edge, [
  "--headless=new",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { windowsHide: true, stdio: "ignore" });

async function waitForDebugger() {
  for (let i = 0; i < 50; i++) {
    try {
      const targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      const target = targets.find((item) => item.type === "page");
      if (target) return target.webSocketDebuggerUrl;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Edge debugger did not start");
}

async function connect(url) {
  const socket = new WebSocket(url);
  const pending = new Map();
  let id = 0;
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    const callback = pending.get(message.id);
    pending.delete(message.id);
    callback(message);
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  return {
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const callId = ++id;
        pending.set(callId, (message) => message.error ? reject(new Error(message.error.message)) : resolve(message.result));
        socket.send(JSON.stringify({ id: callId, method, params }));
      });
    },
    async evaluate(expression) {
      const result = await this.send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
      return result.result.value;
    },
    close() { socket.close(); },
  };
}

let client;
try {
  client = await connect(await waitForDebugger());
  await client.send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
  for (const page of ["sabores.html", "dolcezze.html"]) {
    await client.send("Page.navigate", { url: pathToFileURL(join(import.meta.dirname, page)).href });
    for (const preference of ["no-preference", "reduce", "no-preference"]) {
      await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: preference }] });
      let stages;
      for (let i = 0; i < 50; i++) {
        const result = await client.send("Runtime.evaluate", {
          expression: `document.readyState === 'complete' && location.pathname.endsWith(${JSON.stringify(page)}) && [...document.querySelectorAll('.product-stage,.flavor-stage')].map(stage => ({stage:stage.getBoundingClientRect().height,scene:stage.firstElementChild.getBoundingClientRect().height}))`,
          returnByValue: true,
        });
        stages = result.result.value;
        if (stages?.length) break;
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      assert.ok(stages?.length, `${page} has product scenes`);
      for (const [index, { stage, scene }] of stages.entries()) {
        assert.ok(stage > scene, `${page} ${preference} scene ${index + 1} lost its scroll stage`);
      }

      const sample = async (offset) => client.evaluate(`(async () => {
        const stage = document.querySelector('.flavor-stage');
        window.scrollTo({top: stage.offsetTop + ${offset}, behavior: 'instant'});
        await new Promise(resolve => setTimeout(resolve, 200));
        return stage.querySelector('.flavor-scene-image img').style.getPropertyValue('--scene-shift-y');
      })()`);
      const before = await sample(20);
      const after = await sample(140);
      assert.ok(before && after && before !== after, `${page} ${preference} has no scroll image motion`);

      const transitions = await client.evaluate(`(() => {
        document.documentElement.classList.add('page-exiting');
        const page = parseFloat(getComputedStyle(document.querySelector('.page-transition')).transitionDuration);
        document.documentElement.classList.remove('page-exiting');
        const reveal = parseFloat(getComputedStyle(document.querySelector('.reveal')).transitionDuration);
        return {page, reveal};
      })()`);
      assert.ok(transitions.page >= 0.5, `${page} ${preference} lost page transition`);
      assert.ok(transitions.reveal >= 0.8, `${page} ${preference} lost reveal transition`);
      console.log(`${page} ${preference}: ${stages.length} scenes and animations checked`);
    }
  }
  await client.send("Page.navigate", { url: pathToFileURL(join(import.meta.dirname, "index.html")).href });
  for (const preference of ["no-preference", "reduce"]) {
    await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: preference }] });
    const sample = async (offset) => client.evaluate(`(async () => {
      if (!location.pathname.endsWith('index.html')) return '';
      window.scrollTo({top: ${offset}, behavior: 'instant'});
      await new Promise(resolve => setTimeout(resolve, 200));
      return document.querySelector('.hero-statue').style.getPropertyValue('--hero-shift-y');
    })()`);
    const before = await sample(20);
    const after = await sample(140);
    assert.ok(before && after && before !== after, `index.html ${preference} has no hero scroll motion`);
    const scrollBehavior = await client.evaluate("getComputedStyle(document.documentElement).scrollBehavior");
    assert.equal(scrollBehavior, "smooth", `index.html ${preference} lost smooth anchor scroll`);
    console.log(`index.html ${preference}: hero and smooth scroll checked`);
  }
} finally {
  client?.close();
  browser.kill();
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
