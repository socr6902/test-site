/* ---------- lock overlay to image ---------- */
const IMG_NAT = { w: 5490, h: 3402 };
const SCREEN_BOX = { x: 1895, y: 450, w: 1675, h: 1320 };

(function lockOverlay(){
  const hero = document.getElementById('hero');
  const img  = document.getElementById('heroImg');
  const box  = document.getElementById('screen');

  function place(){
    const cw = hero.clientWidth, ch = hero.clientHeight;
    const scale = Math.max(cw / IMG_NAT.w, ch / IMG_NAT.h);
    const dispW = IMG_NAT.w * scale, dispH = IMG_NAT.h * scale;
    const offX = (cw - dispW)/2, offY = (ch - dispH)/2;

    const left = offX + SCREEN_BOX.x * scale;
    const top = offY + SCREEN_BOX.y * scale;
    const width = SCREEN_BOX.w * scale;
    const height = SCREEN_BOX.h * scale;

    box.style.left = left+'px';
    box.style.top = top+'px';
    box.style.width = width+'px';
    box.style.height = height+'px';
  }
  if (img.complete) place();
  img.addEventListener('load', place);
  window.addEventListener('resize', place);
  window.addEventListener('orientationchange', place);
})();

/* ---------- typing effect ---------- */
(function(){
  const el = document.getElementById("typeTarget");
  if (!el) return;
  const full = (el.dataset.text || "").replace(/\\n/g,"\n");
  const caret = el.querySelector(".caret");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce){ el.textContent = full; return; }

  el.textContent = ""; el.appendChild(caret);
  let i=0; const base=55, pause=250;
  (function next(){
    if (i>=full.length) return;
    const ch=full[i++]; caret.before(ch);
    let d=base+Math.random()*80;
    if (/[.,!?…]/.test(ch)) d+=pause;
    if (ch===" ") d-=25;
    setTimeout(next,d);
  })();
})();

/* ---------- retro sparkle trail ---------- */
document.addEventListener('mousemove', e => {
  const sparkle = document.createElement('div');
  sparkle.className = 'sparkle';
  sparkle.textContent = Math.random() > 0.5 ? '✧' : '✦';

  const size = 10 + Math.random() * 6;
  sparkle.style.left = `${e.clientX - size / 2}px`;
  sparkle.style.top  = `${e.clientY - size / 2}px`;
  sparkle.style.fontSize = `${size}px`;
  sparkle.style.rotate = `${Math.random() * 360}deg`;

  document.body.appendChild(sparkle);
  setTimeout(() => sparkle.remove(), 700);
});

/* ---------- up/down navigation via buttons + keyboard ---------- */
(function(){
  const container = document.getElementById('slides');
  const sections  = Array.from(container.querySelectorAll('section.slide'));
  const upBtn     = document.getElementById('keyUp');
  const downBtn   = document.getElementById('keyDown');

  function currentIndex(){
    let idx = 0, min = Infinity;
    sections.forEach((s,i)=>{
      const d = Math.abs(s.getBoundingClientRect().top);
      if (d < min) { min = d; idx = i; }
    });
    return idx;
  }

  function go(delta){
    const i = currentIndex();
    const target = sections[Math.max(0, Math.min(sections.length - 1, i + delta))];
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  upBtn?.addEventListener('click',  () => go(-1));
  downBtn?.addEventListener('click', () => go(1));

  // Keyboard: ArrowUp/ArrowDown, PageUp/PageDown, Space/Shift+Space (accessible)
  window.addEventListener('keydown', (e) => {
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault(); go(1);
    }
    if (e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) {
      e.preventDefault(); go(-1);
    }
  }, { passive: false });
})();

