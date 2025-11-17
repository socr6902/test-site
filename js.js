/* ---------- lock overlay to image ---------- */
const IMG_NAT = { w: 5490, h: 3402 };
const SCREEN_BOX = { x: 1900, y: 450, w: 1670, h: 1345 };

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

(function(){
  const container=document.getElementById('slides');
  const sections=[...container.querySelectorAll('section.slide')];
  const dotsContainer=document.getElementById('dots-container');

  // Generate dots dynamically based on number of slides
  sections.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'dot';
    btn.setAttribute('aria-current', i === 0 ? 'true' : 'false');
    btn.setAttribute('aria-label', `Go to slide ${i + 1}`);
    dotsContainer.appendChild(btn);
  });

  const dots=[...dotsContainer.querySelectorAll('.dot')];

  function currentIndex(){
    let idx=0,min=Infinity;
    sections.forEach((s,i)=>{
      const d=Math.abs(s.getBoundingClientRect().top);
      if(d<min){min=d;idx=i;}
    });
    return idx;
  }

  function goToIndex(i){
    const clamped=Math.max(0,Math.min(sections.length-1,i));
    sections[clamped].scrollIntoView({behavior:'smooth'});
    updateDots(clamped);
  }

  window.addEventListener('keydown',e=>{
    const tag=document.activeElement?.tagName;
    if(tag==='INPUT'||tag==='TEXTAREA'||document.activeElement?.isContentEditable) return;
    const idx=currentIndex();
    if(['ArrowDown','PageDown'].includes(e.key)){ e.preventDefault(); goToIndex(idx+1); }
    if(['ArrowUp','PageUp'].includes(e.key)){ e.preventDefault(); goToIndex(idx-1); }
  });

  dots.forEach((btn,i)=>btn.addEventListener('click',()=>goToIndex(i)));

  const obs=new IntersectionObserver(ents=>{
    ents.forEach(ent=>{
      if(ent.isIntersecting){ updateDots(sections.indexOf(ent.target)); }
    });
  },{root:container,threshold:0.6});
  sections.forEach(s=>obs.observe(s));

  function updateDots(activeIdx){
    dots.forEach((d,i)=>d.setAttribute('aria-current',i===activeIdx?'true':'false'));
  }
})();
