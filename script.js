  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

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



// AUTO SCROLL 
let autoScrollRAF = null;
let doorOpened = false;
let isAutoScrolling = false;
let scrollAccumulator = 0;
let cachedViewportHeight = 0;
let cachedDocHeight = 0;

const SCROLL_SPEED = 0.8; // px per frame — lower = slower

function autoScrollStep() {
  if (!isAutoScrolling) return;

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
  document.documentElement.style.scrollBehavior = '';
}

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
