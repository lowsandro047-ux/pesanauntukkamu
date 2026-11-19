/* ============================================================
   ✏️ UBAH BAGIAN INI SAJA UNTUK MENGGANTI ISI PESAN
   ============================================================ */
const CONFIG = {
  targetName: "Kamu",      // nama gebetanmu, mis. "Sinta"
  myName: "Aku",           // namamu

  // Halaman 1: isi `` kalau bagian itu tidak mau dipakai (elemen kosong otomatis disembunyikan)
  greeting: (t) => ``,

  introTitle: (t, me) => ``,
  introText: (t, me) =>
    `makasih sudah mauu di buka i, mungkin cwo pertama yang kasih ki begini dan mungkin lebay tapi untuk lucu lucuan saja hahaha\n` +
    `okay kalau siap mi pencetki tombol lanjut tapi jangaan kaget nah hahhaa`,

  askTitle: (t, me) =>
    `tdk kagetji btw selama kenalanki dan baik ki kurasa kalau mauuki berkenan kak Nadiyah Nur Istiqomah mauu tdk jadi pacarku\n` +
    `yakinka baik ki walaupun blum pernahki ketemu ku harap mauuki\n` +
    `nah pencetmi salah satunya sini heeheh`,
  askHint: `Pilih salah satu jawaban di bawah.`,
  dodgeTexts: [
    "Eh, tombolnya geser sendiri.",
    "Coba lagi...",
    "Nggak bisa dipencet, lho.",
    "Pilih yang satunya aja, ya.",
    "Udah, pencet Iya aja.",
  ],

  thanksTitle: (t, me) => `Makasih ya!`,
  thanksMessage: (t, me) =>
    `makasih sudah mauu di iyakan i hahaha dan sorry kalau lebay lagi dan ku harap mauuki serius itu tadi perkataanku hahaha awalnya bercandaji tapi biarmi bikin serius i haahah\n\n` +
    `ohiye semangaatki juga nah kerja laporanta selanjutnya masih ada skripsi dan apa pun masalahta sekarang yang tdk ku tauu semangaatki nah jangan nyerah di setiap kesulitan pasti ada kemudahan ku harap bisaka bantuki apapun kesulitan ta termasuk dalam kuliah ta\n\n` +
    `makasih sekali lagi btw minta mi nomor ta karena pacaran mi hahahaha :)`,
};
/* ============================================================ */

const $ = (id) => document.getElementById(id);
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

const app = $("app");
const screens = {
  intro: $("screen-intro"),
  ask: $("screen-ask"),
  thanks: $("screen-thanks"),
};
const dial = $("dial");
const btnStart = $("btnStart");
const btnYes = $("btnYes");
const btnNo = $("btnNo");
const noSlot = $("noSlot");
const askHint = $("askHint");

// ---------- Isi teks dari CONFIG ----------
const T = CONFIG.targetName, ME = CONFIG.myName;
$("greetTitle").textContent = CONFIG.greeting(T, ME);
$("introTitle").textContent = CONFIG.introTitle(T, ME);
$("introText").textContent = CONFIG.introText(T, ME);
$("askTitle").textContent = CONFIG.askTitle(T, ME);
askHint.textContent = CONFIG.askHint;
$("thanksTitle").textContent = CONFIG.thanksTitle(T, ME);
$("thanksMsg").textContent = CONFIG.thanksMessage(T, ME);

// ---------- Dial: garis skala + progres ----------
(function buildTicks() {
  const g = $("ticks");
  const NS = "http://www.w3.org/2000/svg";
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2;
    const long = i % 5 === 0;
    const r1 = long ? 104 : 108, r2 = 114;
    const l = document.createElementNS(NS, "line");
    l.setAttribute("x1", 120 + Math.cos(a) * r1);
    l.setAttribute("y1", 120 + Math.sin(a) * r1);
    l.setAttribute("x2", 120 + Math.cos(a) * r2);
    l.setAttribute("y2", 120 + Math.sin(a) * r2);
    l.setAttribute("stroke", "#fff");
    l.setAttribute("stroke-opacity", long ? ".55" : ".28");
    l.setAttribute("stroke-width", "1.5");
    l.setAttribute("stroke-linecap", "round");
    g.appendChild(l);
  }
})();

const arc = $("arc");
const knob = $("knobG");
const RADIUS = 90;
const CIRC = 2 * Math.PI * RADIUS;
arc.style.strokeDasharray = CIRC;
arc.style.strokeDashoffset = CIRC; // mulai kosong, lalu terisi

const TOTAL_STEPS = 3;
function setStep(step) {
  const p = step / TOTAL_STEPS;
  arc.style.strokeDashoffset = CIRC * (1 - p);
  knob.style.transform = `rotate(${p * 360}deg)`;
  $("percent").textContent = Math.round(p * 100) + "%";
}
requestAnimationFrame(() => requestAnimationFrame(() => setStep(1)));

function show(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
  app.dataset.page = name;
  setStep({ intro: 1, ask: 2, thanks: 3 }[name]);
}

// ---------- Efek boneka ----------
const timers = {};
// Memicu class animasi sementara (diulang dari awal tiap kali dipanggil)
function trigger(cls, ms) {
  dial.classList.remove(cls);
  void dial.getBoundingClientRect(); // paksa restart animasi
  dial.classList.add(cls);
  clearTimeout(timers[cls]);
  timers[cls] = setTimeout(() => dial.classList.remove(cls), ms);
}

function shakeScreen() {
  document.body.classList.remove("shake");
  void document.body.offsetWidth;
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 500);
}

// ---------- Halaman 1 -> 2: LEDAKAN ----------
btnStart.addEventListener("click", () => {
  show("ask");
  trigger("boom", 1300);
  shakeScreen();
  burst(90, 1.25);
  setTimeout(() => burst(50, 1), 250);
});

// ============================================================
//  Tombol "Tidak": bisa diklik, tapi setelah diklik langsung bergeser
//  (geseran pendek, selalu tetap di dalam layar)
// ============================================================
const SHIFT = 170;           // seberapa jauh sekali geser (px)
const PAD = 14;              // jarak aman dari tepi layar

let dodgeCount = 0;
let lastHintAt = 0;
let lastTeaseAt = 0;

function makeFloating() {
  if (btnNo.classList.contains("floating")) return;
  const r = btnNo.getBoundingClientRect();
  btnNo.style.width = r.width + "px";
  btnNo.style.height = r.height + "px";
  btnNo.style.left = r.left + "px";
  btnNo.style.top = r.top + "px";
  // Pindah ke <body> supaya posisinya selalu relatif ke layar
  document.body.appendChild(btnNo);
  btnNo.classList.add("floating");
  noSlot.classList.add("vacant");
}

function overlapsYes(x, y, w, h) {
  const yr = btnYes.getBoundingClientRect();
  return (
    x < yr.right + 10 && x + w > yr.left - 10 &&
    y < yr.bottom + 10 && y + h > yr.top - 10
  );
}

// Geser tombol menjauh dari titik (px, py) -- biasanya posisi kursor/jari
function flee(px, py) {
  makeFloating();

  const w = btnNo.offsetWidth;
  const h = btnNo.offsetHeight;
  const maxX = Math.max(PAD, window.innerWidth - w - PAD);
  const maxY = Math.max(PAD, window.innerHeight - h - PAD);
  const cur = btnNo.getBoundingClientRect();
  const hasPoint = Number.isFinite(px) && Number.isFinite(py);

  let best = null, bestScore = -Infinity;
  for (let i = 0; i < 24; i++) {
    const ang = Math.random() * Math.PI * 2;
    const d = SHIFT * (0.7 + Math.random() * 0.6);
    const x = clamp(cur.left + Math.cos(ang) * d, PAD, maxX);
    const y = clamp(cur.top + Math.sin(ang) * d, PAD, maxY);

    let score = Math.hypot(x - cur.left, y - cur.top) > 40 ? 0 : -500; // harus terlihat bergeser
    score += hasPoint
      ? Math.hypot(x + w / 2 - px, y + h / 2 - py)   // makin jauh dari kursor makin bagus
      : Math.random() * 50;
    if (overlapsYes(x, y, w, h)) score -= 400;       // jangan menutupi tombol Iya

    if (score > bestScore) { bestScore = score; best = { x, y }; }
  }

  btnNo.style.left = best.x + "px";
  btnNo.style.top = best.y + "px";

  const now = performance.now();
  if (now - lastHintAt > 500) {
    lastHintAt = now;
    askHint.textContent = CONFIG.dodgeTexts[dodgeCount % CONFIG.dodgeTexts.length];
    dodgeCount++;
  }
  // Boneka ikut ketawa & goyang
  if (now - lastTeaseAt > 700) {
    lastTeaseAt = now;
    trigger("tease", 520);
  }
}

// Tombol "Tidak" bisa diklik / disentuh / ditekan lewat keyboard.
// Setelah diklik, baru ia bergeser menjauh (boneka ikut ketawa).
btnNo.addEventListener("click", (e) => {
  // klik dari keyboard tidak punya koordinat (0,0) -> geser ke arah acak
  if (e.clientX || e.clientY) flee(e.clientX, e.clientY);
  else flee();
});

// Kalau ukuran layar berubah, pastikan tombol tetap di dalam layar
window.addEventListener("resize", () => {
  if (!btnNo.classList.contains("floating")) return;
  const w = btnNo.offsetWidth, h = btnNo.offsetHeight;
  const x = clamp(parseFloat(btnNo.style.left) || PAD, PAD, Math.max(PAD, window.innerWidth - w - PAD));
  const y = clamp(parseFloat(btnNo.style.top) || PAD, PAD, Math.max(PAD, window.innerHeight - h - PAD));
  btnNo.style.left = x + "px";
  btnNo.style.top = y + "px";
});

// ---------- Tombol "Iya": PESTA ----------
btnYes.addEventListener("click", () => {
  btnNo.style.display = "none";
  dial.classList.add("happy");
  show("thanks");
  trigger("boom", 1300);
  shakeScreen();
  startConfetti();
});

$("btnAgain").addEventListener("click", () => {
  trigger("boom", 1300);
  shakeScreen();
  startConfetti();
});

// ============================================================
//  Confetti love
// ============================================================
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let particles = [];
let rafId = null;
let rainUntil = 0;

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const HEART_COLORS = ["#0f3df5", "#4f7bff", "#a9bcff", "#ff4d8d", "#ff8fba", "#ffc2da"];
const BURST_COLORS = ["#ffffff", "#ffc2da", "#ff8fba", "#a9bcff", "#8ff0d4"];

function drawHeart(x, y, size, color, rotation, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  const s = size / 16;
  ctx.beginPath();
  ctx.moveTo(0, 5 * s);
  ctx.bezierCurveTo(-14 * s, -4 * s, -8 * s, -14 * s, 0, -6 * s);
  ctx.bezierCurveTo(8 * s, -14 * s, 14 * s, -4 * s, 0, 5 * s);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function origin() {
  // Ledakan keluar dari boneka
  const r = dial.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

// power > 1 = ledakan lebih kuat
function burst(count, power = 1) {
  const o = origin();
  const palette = power > 1 ? BURST_COLORS.concat(HEART_COLORS) : HEART_COLORS;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = (5 + Math.random() * 11) * power;
    particles.push({
      x: o.x, y: o.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 8 + Math.random() * 18,
      color: palette[(Math.random() * palette.length) | 0],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.25,
      life: 1,
      decay: 0.003 + Math.random() * 0.005,
    });
  }
  if (!rafId) rafId = requestAnimationFrame(tick);
}

function rain(count) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: -20,
      vx: (Math.random() - 0.5) * 2,
      vy: 2 + Math.random() * 3,
      size: 10 + Math.random() * 16,
      color: HEART_COLORS[(Math.random() * HEART_COLORS.length) | 0],
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.1,
      life: 1,
      decay: 0.002,
    });
  }
}

function tick(now) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  if (now < rainUntil) rain(2);

  particles = particles.filter((p) => p.life > 0 && p.y < window.innerHeight + 40);
  for (const p of particles) {
    p.vy += 0.12;
    p.vx *= 0.99;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life -= p.decay;
    drawHeart(p.x, p.y, p.size, p.color, p.rot, Math.max(p.life, 0));
  }

  if (particles.length > 0 || now < rainUntil) {
    rafId = requestAnimationFrame(tick);
  } else {
    rafId = null;
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

function startConfetti() {
  burst(170, 1.35);
  setTimeout(() => burst(110, 1.1), 400);
  setTimeout(() => burst(110, 1.1), 900);
  rainUntil = performance.now() + 6500;
  if (!rafId) rafId = requestAnimationFrame(tick);
}
