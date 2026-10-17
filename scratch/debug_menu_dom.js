const http = require('http');
const { spawn } = require('child_process');

async function debugDOM() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9340',
    '--window-size=1440,900',
    'http://localhost:3000'
  ]);
  await new Promise(r => setTimeout(r, 2500));
  const json = await new Promise(res => http.get('http://127.0.0.1:9340/json', r => {
    let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
  }));
  const ws = new WebSocket(json.find(t => t.type === 'page').webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function send(id, method, params = {}) {
    return new Promise((resolve, reject) => {
      const handler = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === id) {
          ws.removeEventListener('message', handler);
          if (data.error) reject(data.error);
          else resolve(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  // Click CATEGORIES +
  await send(1, 'Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('.marker-btn-root, span, a, button'));
        const catEl = els.find(b => b.textContent && b.textContent.trim().startsWith('CATEGORIES'));
        if (catEl) catEl.click();
      })()
    `
  });

  await new Promise(r => setTimeout(r, 1200));

  const res = await send(2, 'Runtime.evaluate', {
    expression: `
      JSON.stringify((() => {
        const catMenu = document.querySelector('.menu--categories');
        const inner = catMenu ? catMenu.querySelector('.menu__inner') : null;
        const list = catMenu ? catMenu.querySelector('.menu__list') : null;
        const firstLi = list ? list.querySelector('li') : null;
        const title = catMenu ? catMenu.querySelector('.menu__title') : null;

        return {
          menuActive: catMenu ? catMenu.classList.contains('active') : null,
          innerRect: inner ? inner.getBoundingClientRect() : null,
          innerZIndex: inner ? getComputedStyle(inner).zIndex : null,
          listRect: list ? list.getBoundingClientRect() : null,
          listBlend: list ? getComputedStyle(list).mixBlendMode : null,
          firstLiTransform: firstLi ? getComputedStyle(firstLi).transform : null,
          firstLiOpacity: firstLi ? getComputedStyle(firstLi).opacity : null,
          firstLiColor: firstLi ? getComputedStyle(firstLi.querySelector('button') || firstLi).color : null,
          firstLiRect: firstLi ? firstLi.getBoundingClientRect() : null,
          titleTransform: title ? getComputedStyle(title).transform : null,
          titleColor: title ? getComputedStyle(title).color : null,
          titleBlend: title ? getComputedStyle(title).mixBlendMode : null,
          titleRect: title ? title.getBoundingClientRect() : null
        };
      })())
    `
  });

  console.log('DOM debug info:\n', res.result.value);

  ws.close();
  chrome.kill();
}

debugDOM();
