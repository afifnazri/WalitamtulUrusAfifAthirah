    // ADD THIS FIRST
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

// function openInvitation() {
//   const audio = document.getElementById('bg-audio');
//   const icon = document.querySelector('#music-toggle i');
//   audio.play();
//   icon.classList.remove('fa-music');
//   icon.classList.add('fa-pause');

//   const overlay = document.getElementById('door-overlay');
//   overlay.style.opacity = '0';
//   overlay.style.visibility = 'hidden';
//   setTimeout(() => { overlay.style.display = 'none'; }, 800);
// }


function toggleMusicPlayer() {
  const audio = document.getElementById('bg-audio');
  const icon = document.querySelector('#music-toggle i');
  if (audio.paused) {
    audio.play();
    icon.classList.remove('fa-music');
    icon.classList.add('fa-pause');
  } else {
    audio.pause();
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-music');
  }
}

document.addEventListener('visibilitychange', () => {
  const audio = document.getElementById('bg-audio');
  const icon = document.querySelector('#music-toggle i');
  if (document.hidden) {
    audio.pause();
    icon.classList.remove('fa-pause');
    icon.classList.add('fa-music');
  }
});

// SCROLL REVEAL
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    } 
    else {
      entry.target.classList.remove('show');
    }

  });

}, {
  // threshold: 0.2,
  threshold: 0,
  rootMargin: '0px 0px -1% 0px' // 

});


reveals.forEach(el => {
  revealObserver.observe(el);
});


// NAV DOTS
var sections = [
  'sec-0',
  'sec-1',
  'sec-2',
  'sec-3'
];
  var dots = document.querySelectorAll('.nav-dot');
  function goTo(i) { document.getElementById(sections[i]).scrollIntoView({ behavior:'smooth' }); }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        var idx = sections.indexOf(e.target.id);
        dots.forEach(function(d) { d.classList.remove('active'); });
        if (idx > -1) dots[idx].classList.add('active');
      }
    });
  }, { threshold: 0.5 });
  sections.forEach(function(id) { observer.observe(document.getElementById(id)); });

// RSVP SHEET
const scriptURL =
  "https://script.google.com/macros/s/AKfycbzSPKZfUKQkaDvcHrmafMNPBtwAmsejO2hIjyR2XYWnITHG6IKSTWIEqqFobqySklg3/exec";

const form = document.getElementById("rsvp-form");
const btn = document.getElementById("rsvp-btn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  btn.disabled = true;
  btn.textContent = "Menghantar...";

  const data = {
    name: document.getElementById("guest-name").value,
    attendance: document.getElementById("guest-count").value
  };

  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    const result = await response.json();

    form.reset();
    btn.textContent = "Berjaya dihantar";

    setTimeout(() => {
      btn.textContent = "TEKAN UNTUK RSVP";
      btn.disabled = false;
    }, 2200);

  } catch (error) {
    console.error(error);

    btn.textContent = "Gagal dihantar";

    setTimeout(() => {
      btn.textContent = "RSVP";
      btn.disabled = false;
    }, 2200);
  }
});

// ON-SCREEN DEBUG OVERLAY — shows console.log output directly on the phone screen.
// Remove this whole block once debugging is done.
(function() {
  const box = document.createElement('div');
  box.id = 'debug-overlay';
  box.style.cssText = 'position:fixed;bottom:0;left:0;right:0;max-height:40vh;overflow-y:auto;' +
    'background:rgba(0,0,0,0.85);color:#0f0;font-size:11px;font-family:monospace;' +
    'padding:8px;z-index:999999;white-space:pre-wrap;';
  document.body.appendChild(box);
  const origLog = console.log;
  console.log = function(...args) {
    origLog.apply(console, args);
    const line = document.createElement('div');
    line.textContent = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
    box.appendChild(line);
    box.scrollTop = box.scrollHeight;
  };
})();

// AUTO SCROLL (movie-credits style — continuous, slow) — mobile-safe version
let autoScrollRAF = null;
let doorOpened = false;
let isAutoScrolling = false;
let scrollAccumulator = 0;
let cachedViewportHeight = 0;
let cachedDocHeight = 0;

const SCROLL_SPEED = 0.8; // px per frame — lower = slower

function autoScrollStep() {
  if (!isAutoScrolling) return;

  // use cached values instead of reading live — avoids mobile address-bar resize glitches
  const atBottom = cachedViewportHeight + window.scrollY >= cachedDocHeight - 2;
  if (atBottom) {
    console.log('[autoscroll] stopped: reached bottom', {
      viewportHeight: cachedViewportHeight,
      scrollY: window.scrollY,
      docHeight: cachedDocHeight
    });
    isAutoScrolling = false;
    return;
  }

  scrollAccumulator += SCROLL_SPEED;

  if (scrollAccumulator >= 1) {
    const pixelsToScroll = Math.floor(scrollAccumulator);
    scrollAccumulator -= pixelsToScroll;

    window.scrollTo({
      top: window.scrollY + pixelsToScroll,
      behavior: 'auto'
    });
  }

  autoScrollRAF = requestAnimationFrame(autoScrollStep);
}

function startAutoScroll() {
  if (!doorOpened || isAutoScrolling) return;

  // CRITICAL FIX: CSS `html { scroll-behavior: smooth }` conflicts with rapid
  // per-frame scrollTo calls on mobile — each tiny scroll gets treated as its
  // own smooth animation and cancels the previous one before it finishes,
  // so nothing visibly moves. Force 'auto' just for the duration of the autoscroll.
  document.documentElement.style.scrollBehavior = 'auto';

  cachedViewportHeight = window.innerHeight;
  cachedDocHeight = document.documentElement.scrollHeight;

  console.log('[autoscroll] starting', {
    viewportHeight: cachedViewportHeight,
    docHeight: cachedDocHeight
  });

  isAutoScrolling = true;
  scrollAccumulator = 0;
  autoScrollRAF = requestAnimationFrame(autoScrollStep);
}

function stopAutoScroll() {
  if (isAutoScrolling) {
    console.log('[autoscroll] stopped: user interaction');
  }
  isAutoScrolling = false;
  if (autoScrollRAF) {
    cancelAnimationFrame(autoScrollRAF);
    autoScrollRAF = null;
  }
  // restore normal smooth scrolling for nav-dot clicks etc.
  document.documentElement.style.scrollBehavior = '';
}

// NOTE: kept 'touchstart' here on purpose (stops scroll on user touch) —
// if you find it's stopping too eagerly on mobile, try removing 'touchstart'
// and relying on 'wheel' + 'keydown' + a custom touchmove-with-distance-check instead
['touchstart', 'mousedown', 'wheel', 'keydown'].forEach(event => {
  document.addEventListener(event, () => {
    stopAutoScroll();
  });
});

function openInvitation() {
  console.log('[openInvitation] called');
  const audio = document.getElementById('bg-audio');
  const icon = document.querySelector('#music-toggle i');
  audio.play().catch(err => console.log('[audio] play blocked:', err));
  icon.classList.remove('fa-music');
  icon.classList.add('fa-pause');

  const overlay = document.getElementById('door-overlay');
  overlay.style.opacity = '0';
  overlay.style.visibility = 'hidden';
  setTimeout(() => { overlay.style.display = 'none'; }, 800);

  doorOpened = true;
  console.log('[openInvitation] doorOpened=true, scheduling startAutoScroll in 1500ms');
  setTimeout(() => {
    console.log('[timeout fired] calling startAutoScroll, doorOpened=', doorOpened);
    startAutoScroll();
  }, 1500);
}
