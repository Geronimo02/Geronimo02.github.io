import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const edge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const profile = await mkdtemp(join(tmpdir(), "motion-preference-"));
const port = 19349;
const browser = spawn(edge, ["--headless=new", "--disable-gpu", "--allow-file-access-from-files", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { windowsHide: true, stdio: "ignore" });

async function connect() {
  let target;
  for (let i = 0; i < 50; i++) {
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((entry) => entry.type === "page");
      if (target) break;
    } catch {}
    await new Promise((done) => setTimeout(done, 100));
  }
  assert.ok(target, "Edge debugger started");
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map();
  let id = 0;
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (!message.id) return;
    pending.get(message.id)(message);
    pending.delete(message.id);
  });
  await new Promise((done, fail) => { socket.addEventListener("open", done, { once: true }); socket.addEventListener("error", fail, { once: true }); });
  return {
    send(method, params = {}) {
      return new Promise((done, fail) => {
        const callId = ++id;
        pending.set(callId, (message) => message.error ? fail(new Error(message.error.message)) : done(message.result));
        socket.send(JSON.stringify({ id: callId, method, params }));
      });
    },
    async evaluate(expression) {
      const result = await this.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
      return result.result.value;
    },
    close() { socket.close(); },
  };
}

const pages = [
  ["demos/sushi-fan/index.html", `(() => ({height:document.querySelector('#platosSection').offsetHeight,pin:getComputedStyle(document.querySelector('.platos-pin')).position}))()`],
  ["demos/malabar/index.html", `(() => ({height:document.querySelector('#hero-stage').offsetHeight,events:document.querySelector('#eventos').offsetHeight,motion:document.body.classList.contains('motion-on')}))()`],
  ["demos/Braico-B4-Real/index.html", `(() => ({animation:getComputedStyle(document.querySelector('.hero-eyebrow')).animationDuration,motion:document.documentElement.classList.contains('b3-animated')}))()`],
  ["demos/Braico-B4-Real/Braico-B4.html", `(() => ({animation:getComputedStyle(document.querySelector('.hero-eyebrow')).animationDuration,motion:document.documentElement.classList.contains('b3-animated')}))()`],
  ["demos/malabar/MALABAR_V3/preview/index.html", `(() => ({height:document.querySelector('#hero-stage').offsetHeight,motion:document.body.classList.contains('motion-on')}))()`],
  ["demos/malabar/MALABAR_V3/MALABAR_V3_PREVIEW.html", `(() => ({height:document.querySelector('#hero-stage').offsetHeight,motion:document.body.classList.contains('motion-on')}))()`],
  ["demos/fooster club/index.html", `(() => ({animation:getComputedStyle(document.querySelector('.hero-photo img')).animationDuration}))()`],
  ["demos/foster bar/index.html", `(() => ({motion:document.documentElement.classList.contains('motion-ready'),transition:getComputedStyle(document.querySelector('[data-reveal]')).transitionDuration}))()`],
  ["demos/calabaza/index.html", `(() => ({motion:document.documentElement.classList.contains('motion-ready'),reveals:document.querySelectorAll('.reveal').length}))()`],
  ["demos/Hasta el moño Version_Final/index.html", `(() => ({reveals:document.querySelectorAll('.reveal').length,transition:getComputedStyle(document.querySelector('.reveal')).transitionDuration}))()`],
  ["demos/hasta-el-mono-demo-v2/hasta-el-mono-demo-v2/index.html", `(() => ({animation:getComputedStyle(document.querySelector('.hero-plate img')).animationDuration}))()`],
  ["demos/cener house/index.html", `(() => ({scroll:getComputedStyle(document.documentElement).scrollBehavior}))()`],
  ["index.html", `(() => ({scroll:getComputedStyle(document.documentElement).scrollBehavior}))()`],
  ["landing/index.html", `(() => ({scroll:getComputedStyle(document.documentElement).scrollBehavior}))()`],
  ["casos/orbe.html", `(() => ({animation:getComputedStyle(document.querySelector('.orbe-preview-bookings i')).animationDuration}))()`],
];

let client;
try {
  client = await connect();
  await client.send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 900, deviceScaleFactor: 1, mobile: false });
  for (const [page, expression] of pages) {
    const samples = [];
    for (const preference of ["no-preference", "reduce"]) {
      await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: preference }] });
      const url = pathToFileURL(resolve(import.meta.dirname, "..", page)).href;
      await client.send("Page.navigate", { url });
      let ready = false;
      for (let i = 0; i < 50; i++) {
        ready = await client.evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`);
        if (ready) break;
        await new Promise((done) => setTimeout(done, 100));
      }
      assert.ok(ready, `${page} loaded`);
      await new Promise((done) => setTimeout(done, 100));
      samples.push(await client.evaluate(expression));
      if (page.includes("sushi-fan") || page === "demos/malabar/index.html") {
        const selector = page.includes("sushi-fan") ? "#platosSection" : "#hero-stage";
        const target = page.includes("sushi-fan") ? "#platosTrack" : ".hero-frame";
        const measure = async (offset) => client.evaluate(`(async () => {
          const stage = document.querySelector(${JSON.stringify(selector)});
          window.scrollTo({top: stage.getBoundingClientRect().top + scrollY + ${offset}, behavior: 'instant'});
          await new Promise(done => setTimeout(done, 150));
          return document.querySelector(${JSON.stringify(target)}).style.transform;
        })()`);
        const first = await measure(20);
        const second = await measure(180);
        assert.ok(first && second && first !== second, `${page} ${preference} lost scroll animation`);
      }
    }
    assert.deepEqual(samples[1], samples[0], `${page} changes when Windows requests reduced motion`);
    console.log(`${page}: same motion state in both modes`, samples[0]);
  }
  await client.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  for (const [page, expression] of pages.slice(0, 3)) {
    const samples = [];
    for (const preference of ["no-preference", "reduce"]) {
      await client.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: preference }] });
      const url = pathToFileURL(resolve(import.meta.dirname, "..", page)).href;
      await client.send("Page.navigate", { url });
      for (let i = 0; i < 50; i++) {
        if (await client.evaluate(`document.readyState === 'complete' && location.href === ${JSON.stringify(url)}`)) break;
        await new Promise((done) => setTimeout(done, 100));
      }
      await new Promise((done) => setTimeout(done, 100));
      samples.push(await client.evaluate(expression));
    }
    assert.deepEqual(samples[1], samples[0], `${page} changes on mobile when Windows requests reduced motion`);
    console.log(`${page}: same mobile layout in both modes`, samples[0]);
  }
} finally {
  client?.close();
  browser.kill();
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
