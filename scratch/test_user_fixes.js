const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function testFixes() {
  console.log('--- STARTING CDP VERIFICATION TEST ---');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    '--headless=new',
    '--remote-debugging-port=9477',
    '--window-size=1440,900',
    '--disable-gpu',
    'http://localhost:3000'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2500));
    const json = await new Promise((res, rej) => http.get('http://127.0.0.1:9477/json', r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }).on('error', rej));

    const target = json.find(t => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let msgId = 1;
    const send = (method, params = {}) => new Promise((res, rej) => {
      const curId = msgId++;
      const handler = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.id === curId) {
          ws.removeEventListener('message', handler);
          if (data.error) rej(data.error); else res(data.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

    const evalJs = async (expr) => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
      return res.result ? res.result.value : null;
    };

    console.log('Page loaded. Waiting for hydration...');
    await new Promise(r => setTimeout(r, 2000));

    // TEST 1: ARRIVALS AUTO-ROTATION & HOVER PAUSE
    console.log('\n--- 1. Testing NEW ARRIVALS auto-rotation & hover pause ---');
    const getArrivalTitle = async () => {
      return evalJs(`(() => {
        const activeLi = document.querySelector('.arrivals-section__group-swiper.one > li.active');
        if (!activeLi) return null;
        const titleEl = activeLi.querySelector('.arrivals-card__title');
        return titleEl ? titleEl.textContent.trim() : null;
      })()`);
    };

    // Scroll arrivals into view
    await evalJs(`(() => {
      const el = document.querySelector('#arrivals');
      if (el) el.scrollIntoView({ block: 'center' });
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const initialTitle = await getArrivalTitle();
    console.log('Initial Arrivals Product:', initialTitle);

    // Hover over arrivals section via hardware mouse move
    const arrivalsBox = await evalJs(`(() => {
      const el = document.querySelector('.arrivals-section__group');
      if (!el) return { x: 500, y: 500 };
      const rect = el.getBoundingClientRect();
      return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
    })()`);

    console.log('Hovering over arrivals card via CDP Input.dispatchMouseEvent at', arrivalsBox);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: arrivalsBox.x, y: arrivalsBox.y });
    await new Promise(r => setTimeout(r, 5500));
    const titleDuringHover = await getArrivalTitle();
    console.log('Product during hover (should be SAME):', titleDuringHover);
    if (initialTitle === titleDuringHover) {
      console.log('PASS: Product rotation stayed PAUSED during hover.');
    } else {
      console.error('FAIL: Product changed during hover!');
    }

    // Unhover to let it auto-rotate
    console.log('Mouse leaves arrivals section to test auto-rotation...');
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
    await new Promise(r => setTimeout(r, 5500));
    const titleAfterRotation = await getArrivalTitle();
    console.log('Product after auto-rotation (should be DIFFERENT):', titleAfterRotation);
    if (initialTitle !== titleAfterRotation) {
      console.log('PASS: Arrivals section auto-rotated to new product!');
    } else {
      console.warn('Checking 2s more for transition...');
      await new Promise(r => setTimeout(r, 2000));
      const titleCheck2 = await getArrivalTitle();
      console.log('Product on second check:', titleCheck2);
    }

    // TEST 2: CATEGORIES SLOW-MOVING MARQUEE & HOVER PAUSE
    console.log('\n--- 2. Testing CATEGORIES slow-moving marquee & hover pause ---');
    // Scroll categories into view
    await evalJs(`(() => {
      const el = document.querySelector('#categories');
      if (el) el.scrollIntoView();
    })()`);
    await new Promise(r => setTimeout(r, 500));

    const getCatScroll = () => evalJs(`(() => {
      const track = document.querySelector('.categories-section__list');
      return track ? Math.round(track.scrollLeft) : 0;
    })()`);

    const scroll1 = await getCatScroll();
    console.log('Categories scrollLeft at t=0:', scroll1);
    await new Promise(r => setTimeout(r, 2000));
    const scroll2 = await getCatScroll();
    console.log('Categories scrollLeft at t=2s:', scroll2);
    if (scroll2 > scroll1) {
      console.log(`PASS: Marquee is scrolling gradually (+${scroll2 - scroll1}px in 2s)`);
    } else {
      console.error('FAIL: Marquee did not move!');
    }

    // Hover over categories track
    const catBox = await evalJs(`(() => {
      const el = document.querySelector('.categories-section__list');
      if (!el) return { x: 500, y: 500 };
      const rect = el.getBoundingClientRect();
      return { x: Math.round(rect.left + rect.width / 2), y: Math.round(rect.top + rect.height / 2) };
    })()`);
    console.log('Hovering over categories card via CDP Input.dispatchMouseEvent at', catBox);
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: catBox.x, y: catBox.y });
    await new Promise(r => setTimeout(r, 400));
    const scrollHover1 = await getCatScroll();
    await new Promise(r => setTimeout(r, 2000));
    const scrollHover2 = await getCatScroll();
    console.log('Categories scrollLeft during hover start:', scrollHover1, 'end:', scrollHover2);
    if (scrollHover1 === scrollHover2) {
      console.log('PASS: Marquee movement completely stopped on hover!');
    } else {
      console.error('FAIL: Marquee moved while hovered! Delta:', scrollHover2 - scrollHover1);
    }

    // Unhover
    console.log('Mouse leaves categories track to test resume...');
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 0, y: 0 });
    await new Promise(r => setTimeout(r, 2000));
    const scrollResumed = await getCatScroll();
    console.log('Categories scrollLeft after resuming:', scrollResumed);
    if (scrollResumed > scrollHover2) {
      console.log('PASS: Marquee resumed moving gradually after hover ended!');
    } else {
      console.error('FAIL: Marquee did not resume!');
    }

    // TEST 3: MENU CLOSING ON SHOP ALL CLICK
    console.log('\n--- 3. Testing Menu closing on SHOP ALL click ---');
    console.log('Clicking MENU button to open collections menu...');
    await evalJs(`(() => {
      const btns = Array.from(document.querySelectorAll('header .marker-btn-root'));
      const menuBtn = btns.find(b => b.textContent && b.textContent.includes('MENU'));
      if (menuBtn) menuBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const isMenuOpenBefore = await evalJs(`(() => {
      const menu = document.querySelector('.menu--menu');
      return menu ? menu.classList.contains('active') : false;
    })()`);
    console.log('Is menu active before clicking SHOP ALL?:', isMenuOpenBefore);

    console.log('Clicking SHOP ALL in header...');
    await evalJs(`(() => {
      const items = Array.from(document.querySelectorAll('header a, header .marker-btn-root'));
      const shopAll = items.find(el => el.textContent && el.textContent.includes('SHOP ALL'));
      if (shopAll) {
        const anchor = shopAll.closest('a') || shopAll;
        anchor.click();
      }
    })()`);

    await new Promise(r => setTimeout(r, 2000));
    const pageUrl = await evalJs(`window.location.pathname`);
    console.log('Current URL pathname after click:', pageUrl);

    const isMenuOpenAfter = await evalJs(`(() => {
      const menu = document.querySelector('.menu--menu');
      const catsMenu = document.querySelector('.menu--categories');
      const menuActive = menu ? menu.classList.contains('active') : false;
      const catsActive = catsMenu ? catsMenu.classList.contains('active') : false;
      return menuActive || catsActive;
    })()`);
    console.log('Is menu active after navigation?:', isMenuOpenAfter);

    if (pageUrl === '/products' && !isMenuOpenAfter) {
      console.log('SUCCESS: Navigated to /products and menu CLOSED immediately!');
    } else {
      console.error('FAIL: Menu remained open or url did not match!');
    }

    let snap = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync('scratch/verify_user_fixes.png', Buffer.from(snap.data, 'base64'));
    console.log('Screenshot saved to scratch/verify_user_fixes.png');

    ws.close();
  } catch (err) {
    console.error('Test error:', err);
  } finally {
    chrome.kill();
    console.log('--- TEST COMPLETE ---');
  }
}

testFixes();
