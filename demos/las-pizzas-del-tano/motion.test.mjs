import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const edge = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const profile = await mkdtemp(join(tmpdir(), 'tano-motion-'));
const port = 19348;
const browser = spawn(edge, [
  '--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`, 'about:blank',
], { windowsHide: true, stdio: 'ignore' });

async function connect() {
  let target;
  for (let i = 0; i < 50; i++) {
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(x => x.type === 'page');
      if (target) break;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  assert.ok(target, 'Edge started with a debuggable page');
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  const pending = new Map();
  let id = 0;
  socket.addEventListener('message', ({ data }) => {
    const result = JSON.parse(data);
    const settle = pending.get(result.id);
    if (settle) { pending.delete(result.id); settle(result); }
  });
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  return {
    send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const callId = ++id;
        pending.set(callId, result => result.error ? reject(new Error(result.error.message)) : resolve(result.result));
        socket.send(JSON.stringify({ id: callId, method, params }));
      });
    },
    async evaluate(expression) {
      const response = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text);
      return response.result.value;
    },
    close() { socket.close(); },
  };
}

let client;
try {
  client = await connect();
  await client.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  for (const preference of ['no-preference', 'reduce']) {
    await client.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: preference }] });
    for (const page of ['site/index.html', 'site/index-neon.html', 'site/index-horno.html', 'prototipo/direcciones.html']) {
      await client.send('Page.navigate', { url: pathToFileURL(join(import.meta.dirname, page)).href });
      for (let i = 0; i < 50; i++) {
        if (await client.evaluate(`document.readyState !== 'loading' && location.pathname.endsWith(${JSON.stringify(page.split('/').at(-1))})`)) break;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      const isPrototype = page.startsWith('prototipo/');
      if (isPrototype) {
        const animation = await client.evaluate("getComputedStyle(document.querySelector('.c .neon.flick')).animationName");
        assert.equal(animation, 'flick', `${page} ${preference}: neon flicker`);
        const moved = await client.evaluate(`(async () => {
          const sign = document.getElementById('signA');
          dispatchEvent(new WheelEvent('wheel', { deltaY: 100 }));
          await new Promise(resolve => setTimeout(resolve, 80));
          return sign.style.transform !== '' && sign.style.transform !== 'none';
        })()`);
        assert.ok(moved, `${page} ${preference}: hanging sign moves`);
      } else {
        const result = await client.evaluate(`(() => ({
          hero: getComputedStyle(document.querySelector('.hero h1 .ln > span, .hero h1 .neon.flick')).animationName,
          reveal: parseFloat(getComputedStyle(document.querySelector('.rv')).transitionDuration),
          scroll: getComputedStyle(document.documentElement).scrollBehavior,
          tape: getComputedStyle(document.querySelector('.tape')).display,
          fizz: document.getElementById('fizz')?.width ?? null
        }))()`);
        assert.equal(result.hero, page.endsWith('index-horno.html') ? 'up' : 'flick', `${page} ${preference}: hero entrance`);
        assert.ok(result.reveal > 0, `${page} ${preference}: reveal transition`);
        assert.equal(result.scroll, 'smooth', `${page} ${preference}: anchor scroll`);
        assert.notEqual(result.tape, 'none', `${page} ${preference}: menu photo`);
        if (result.fizz !== null) assert.ok(result.fizz > 0, `${page} ${preference}: glass bubbles initialized`);
        const interaction = await client.evaluate(`(() => {
          document.querySelector('.it[data-img]').dispatchEvent(new PointerEvent('pointerover', { bubbles: true }));
          const tape = document.getElementById('tape').style.opacity;
          const add = document.querySelector('[data-add]');
          add.click();
          return { tape, button: add.classList.contains('done'), fab: document.getElementById('fab').classList.contains('bump') };
        })()`);
        assert.equal(interaction.tape, '1', `${page} ${preference}: menu photo follows hover`);
        assert.ok(interaction.button && interaction.fab, `${page} ${preference}: order feedback animates`);
      }
      console.log(`${page} ${preference}: motion active`);
    }
  }
} finally {
  client?.close();
  browser.kill();
  await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
