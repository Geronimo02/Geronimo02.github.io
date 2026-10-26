const LIVE_ORIGIN = 'https://geronimo02.github.io';
const LOCAL_ORIGINS = new Set(['http://127.0.0.1:5503', 'http://localhost:5503']);

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const allowed = origin === LIVE_ORIGIN || (env.ALLOW_LOCAL_ORIGIN === 'true' && LOCAL_ORIGINS.has(origin));
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'Vary': 'Origin',
    };
    if (allowed) {
      headers['Access-Control-Allow-Origin'] = origin;
      headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }
    const reply = (data, status = 200) => new Response(JSON.stringify(data), { status, headers });
    if (request.method === 'OPTIONS') return new Response(null, { status: allowed ? 204 : 403, headers });
    if (!allowed) return reply({ ok: false, error: 'forbidden' }, 403);
    if (!env.APPS_SCRIPT_URL || !env.BOOKING_SECRET) return reply({ ok: false, error: 'unconfigured' }, 503);

    const path = new URL(request.url).pathname;
    let payload;
    if (path === '/availability' && request.method === 'GET') {
      payload = { action: 'availability', month: new URL(request.url).searchParams.get('month') };
    } else if (path === '/book' && request.method === 'POST') {
      if (Number(request.headers.get('Content-Length') || 0) > 4096) return reply({ ok: false, error: 'invalid_booking' }, 400);
      let data;
      try {
        const body = await request.text();
        if (body.length > 4096) return reply({ ok: false, error: 'invalid_booking' }, 400);
        data = JSON.parse(body);
        payload = {
          action: 'book',
          date: data.date,
          time: data.time,
          name: data.name,
          email: data.email,
          message: data.message,
        };
      } catch {
        return reply({ ok: false, error: 'invalid_booking' }, 400);
      }
      if (!env.TURNSTILE_SECRET || typeof data.turnstileToken !== 'string'
        || !data.turnstileToken || data.turnstileToken.length > 2048) {
        return reply({ ok: false, error: 'verification_required' }, 403);
      }
      try {
        const challenge = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            secret: env.TURNSTILE_SECRET,
            response: data.turnstileToken,
            remoteip: request.headers.get('CF-Connecting-IP') || '',
          }),
        });
        if (!challenge.ok) return reply({ ok: false, error: 'verification_unavailable' }, 503);
        const verification = await challenge.json();
        if (verification.success !== true || verification.action !== 'booking'
          || verification.hostname !== 'geronimo02.github.io') {
          return reply({ ok: false, error: 'verification_failed' }, 403);
        }
      } catch {
        return reply({ ok: false, error: 'verification_unavailable' }, 503);
      }
    } else {
      return reply({ ok: false, error: 'not_found' }, 404);
    }

    try {
      const upstream = await fetch(env.APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ ...payload, secret: env.BOOKING_SECRET }),
        redirect: 'follow',
      });
      if (!upstream.ok) return reply({ ok: false, error: 'booking_unavailable' }, 502);
      const result = await upstream.json();
      if (!result || typeof result.ok !== 'boolean') return reply({ ok: false, error: 'booking_unavailable' }, 502);
      const status = result.ok ? 200 : ([400, 403, 409, 503].includes(result.status) ? result.status : 502);
      const { status: _ignored, ...safeResult } = result;
      return reply(safeResult, status);
    } catch {
      return reply({ ok: false, error: 'booking_unavailable' }, 502);
    }
  },
};
