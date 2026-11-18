/* =========================================================
   EDIT ALL WEDDING DETAILS HERE
   ========================================================= */
const CONFIG = {
  groomName: "Abhijith",
  brideName: "Shilpa",
  groomFull: "Abhijith S",
  brideFull: "Shilpa Das",
  heroDate: "Saturday 23 January<br>2027",
  groomParents: "Late Mr. Sudarsanan Achary<br>Mrs. Sunitha S",
  brideParents: "Mr. Sivadasan P<br>Mrs. Pushpakumari K P",
  blessings: "Krishnadas<br>Aiswarya &amp; Akshaya",

  // Main countdown target (local time)
  weddingDateTime: "2027-01-23T11:15:00",

  // Highlighted days on the Save the Date calendar
  calendar: { year: 2027, month: 1, highlight: [23] },

  events: [
    {
      title: "Wedding",
      datetime: "Saturday, 23 January 2027<br>11:15 AM – 11:45 AM",
      venue: "Meladathu Auditorium, Adoor",
    },
  ],

  venues: [
    {
      tab: "Wedding",
      name: "Meladathu Auditorium, Adoor",
      query: "Meladathu Auditorium Adoor",
      link: "https://maps.app.goo.gl/MZR9AVPGVr9ccUxaA?g_st=iw",
    },
  ],

  phones: ["+91 94957 24903", "+91 80863 15284"],
};

/* ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  bindText();
  setupCover();
  buildCalendar();
  buildEvents();
  buildVenues();
  buildPhones();
  startCountdown();
  setupReveal();
  setupMusic();
});

function bindText() {
  document.querySelectorAll("[data-bind]").forEach((el) => {
    const v = CONFIG[el.dataset.bind];
    if (v != null) {
      if (el.dataset.bind === "heroDate") el.innerHTML = v;
      else el.textContent = v;
    }
  });
  document.querySelectorAll("[data-bind-html]").forEach((el) => {
    const v = CONFIG[el.dataset.bindHtml];
    if (v != null) el.innerHTML = v;
  });
  document.title = `${CONFIG.groomName} & ${CONFIG.brideName} — Wedding`;
}

/* ---------- Envelope cover ---------- */
function setupCover() {
  const cover = document.getElementById("cover");
  document.getElementById("sealL").textContent = CONFIG.groomName.charAt(0).toUpperCase();
  document.getElementById("sealR").textContent = CONFIG.brideName.charAt(0).toUpperCase();
  document.body.classList.add("locked");
  window.scrollTo(0, 0);

  let opened = false;
  cover.addEventListener("click", () => {
    if (opened) return;
    opened = true;
    // iOS (Low Power Mode / data saver) can block autoplay — start it on this tap
    const heroVid = document.querySelector(".hero-frame video");
    if (heroVid) { heroVid.muted = true; const p = heroVid.play(); if (p) p.catch(() => {}); }
    playMusic();
    cover.classList.add("opening");                       // flap flips, seal lifts
    setTimeout(() => cover.classList.add("gone"), 2600);  // envelope fades into hero
    setTimeout(() => document.body.classList.remove("locked"), 4200);
    setTimeout(() => cover.remove(), 5800);
  });
}

/* ---------- Calendar ---------- */
function buildCalendar() {
  const { year, month, highlight } = CONFIG.calendar;
  const monthName = new Date(year, month - 1, 1).toLocaleString("en-US", { month: "long" });
  document.getElementById("calMonth").textContent = `${monthName} ${year}`;

  const cal = document.getElementById("calendar");
  ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((d) => {
    cal.insertAdjacentHTML("beforeend", `<div class="dow">${d}</div>`);
  });
  const first = (new Date(year, month - 1, 1).getDay() + 6) % 7; // Monday-first
  const days = new Date(year, month, 0).getDate();
  for (let i = 0; i < first; i++) cal.insertAdjacentHTML("beforeend", `<div></div>`);
  for (let d = 1; d <= days; d++) {
    const hl = highlight.includes(d);
    cal.insertAdjacentHTML(
      "beforeend",
      hl
        ? `<div class="day hl"><svg viewBox="0 0 32 30"><path d="M16 28C6 20 2 15 2 9.5 2 5.4 5.2 2 9.2 2c2.8 0 5 1.6 6.8 4 1.8-2.4 4-4 6.8-4 4 0 7.2 3.4 7.2 7.5C30 15 26 20 16 28z"/></svg><span>${d}</span></div>`
        : `<div class="day">${d}</div>`
    );
  }
}

/* ---------- Event cards (tap to cycle) ---------- */
function buildEvents() {
  const stack = document.getElementById("eventStack");
  let idx = 0;
  const render = () => {
    const e = CONFIG.events[idx];
    stack.innerHTML = `
      <article class="event-card swap-in">
        <div class="vine" aria-hidden="true"></div>
        <h3>${e.title}</h3>
        <div class="ev-row"><label>Date &amp; Time</label><p>${e.datetime}</p></div>
        <div class="ev-row"><label>Venue</label><p>${e.venue}</p></div>
        <div class="dots">${CONFIG.events.map((_, i) => `<i class="${i === idx ? "on" : ""}"></i>`).join("")}</div>
      </article>`;
  };
  if (CONFIG.events.length < 2) document.querySelector(".events .hint").style.display = "none";
  stack.addEventListener("click", () => {
    idx = (idx + 1) % CONFIG.events.length;
    render();
  });
  render();
}

/* ---------- Venues ---------- */
function buildVenues() {
  const tabs = document.getElementById("venueTabs");
  const show = (i) => {
    const v = CONFIG.venues[i];
    tabs.querySelectorAll("button").forEach((b, j) => b.classList.toggle("active", i === j));
    document.getElementById("venueName").textContent = v.name;
    const q = encodeURIComponent(v.query);
    document.getElementById("venueMap").src = `https://maps.google.com/maps?q=${q}&z=15&output=embed`;
    document.getElementById("venueLink").href = v.link || `https://www.google.com/maps/search/?api=1&query=${q}`;
  };
  if (CONFIG.venues.length < 2) tabs.style.display = "none";
  CONFIG.venues.forEach((v, i) => {
    const b = document.createElement("button");
    b.textContent = v.tab;
    b.onclick = () => show(i);
    tabs.appendChild(b);
  });
  show(0);
}

function buildPhones() {
  document.getElementById("phones").innerHTML = CONFIG.phones
    .map((p) => `<a class="phone-btn" href="tel:${p.replace(/\s/g, "")}">${p}</a>`)
    .join("");
}

/* ---------- Countdown ---------- */
function startCountdown() {
  const target = new Date(CONFIG.weddingDateTime);
  document.getElementById("cdDate").textContent = target.toLocaleString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  }).replace(",", "").replace(/ at |, /, " at ").replace("am", "AM").replace("pm", "PM");

  const set = (id, v) => (document.getElementById(id).textContent = v);
  const tick = () => {
    let diff = Math.max(0, target - new Date());
    const d = Math.floor(diff / 864e5); diff -= d * 864e5;
    const h = Math.floor(diff / 36e5); diff -= h * 36e5;
    const m = Math.floor(diff / 6e4); diff -= m * 6e4;
    const s = Math.floor(diff / 1e3);
    set("cdDays", d); set("cdHours", h); set("cdMins", m); set("cdSecs", s);
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- Scroll reveal ---------- */
function setupReveal() {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

/* ---------- Music ---------- */
let musicBtn, musicAudio;

function setupMusic() {
  musicBtn = document.getElementById("musicBtn");
  musicAudio = document.getElementById("bgMusic");
  musicBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleMusic(); });
  window.addEventListener("pagehide", stopMedia);
  window.addEventListener("beforeunload", stopMedia);
}

function playMusic() {
  if (!musicAudio || !musicAudio.paused) return;
  const p = musicAudio.play();
  if (p) p.then(() => musicBtn.classList.add("playing")).catch(() => {});
}

function stopMusic() {
  if (!musicAudio) return;
  musicAudio.pause();
  if (musicBtn) musicBtn.classList.remove("playing");
}

function toggleMusic() {
  if (!musicAudio) return;
  if (musicAudio.paused) playMusic();
  else stopMusic();
}

function stopMedia() {
  stopMusic();
  const heroVid = document.querySelector(".hero-frame video");
  if (heroVid) heroVid.pause();
}
