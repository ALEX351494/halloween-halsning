
const $ = (id) => document.getElementById(id);

const desktop = $("desktop");
const cardWindow = $("cardWindow");
const updateScreen = $("updateScreen");
const toast = $("toast");

let audioContext;
let chaosStarted = false;
let toastTimer;
let chaosTimers = [];

const errors = [
  ["VIRUS DETECTED", "Ett spöke har hittat in i datorn!"],
  ["UPDATE FAILED", "Pumpauppdateringen misslyckades."],
  ["ERROR 404", "Det efterfrågade godiset saknas."],
  ["CRITICAL ERROR", "För många spöken i systemet!"],
  ["SYSTEM ALERT", "En fladdermus har tagit över skrivbordet."],
  ["WARNING", "Tangentbordet är hemsökt."],
  ["UPDATE REQUIRED", "Installera fler Halloween-pumpor."],
  ["ERROR 666", "Mystisk aktivitet upptäckt!"],
  ["VIRUS DETECTED", "En zombie har hittat dina filer."],
  ["CONNECTION LOST", "Kontakt med spökvärlden förlorad."],
  ["FATAL ERROR", "Spöket vägrar lämna datorn."],
  ["SYSTEM WARNING", "Fladdermöss upptäckta i systemet."],
  ["UPDATE FAILED", "Häxkvasten kunde inte uppdateras."],
  ["SYSTEM ERROR", "Halloween-systemet är hemsökt."],
  ["FINAL WARNING", "Du har väckt alla 15 spöken!"]
];

function playTone(frequency = 440, duration = 0.18) {
  const AudioClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioClass) return;

  try {
    audioContext ??= new AudioClass();

    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      frequency, audioContext.currentTime
    );

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.07, audioContext.currentTime + 0.02
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001, audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn("Ljud kunde inte spelas upp.", error);
  }
}

function playSpookySound() {
  playTone(130, 0.7);
  setTimeout(() => playTone(174, 0.8), 180);
  setTimeout(() => playTone(110, 1), 380);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3500);
}

function openWindow(id) {
  $(id).classList.remove("hidden");
  playTone(520, 0.12);
}

$("openCard").addEventListener("click", () => {
  openWindow("cardWindow");
  playSpookySound();
});

$("welcomeOpen").addEventListener("click", () => {
  openWindow("cardWindow");
  playSpookySound();
});

$("taskbarCard").addEventListener("click", () => {
  openWindow("cardWindow");
});

$("openComputer").addEventListener("click", () => {
  openWindow("computerWindow");
});

$("openBin").addEventListener("click", () => {
  openWindow("binWindow");
});

document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    $(button.dataset.close).classList.add("hidden");
    playTone(300, 0.1);
  });
});

function createError(message, index) {
  const box = document.createElement("section");
  box.className = "error-window";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", message[0]);

  const width = Math.min(280, desktop.clientWidth - 30);
  const maxX = Math.max(0, desktop.clientWidth - width);
  const maxY = Math.max(75, desktop.clientHeight - 230);

  box.style.left = `${Math.random() * maxX}px`;
  box.style.top = `${65 + Math.random() * (maxY - 65)}px`;

  const title = document.createElement("div");
  title.className = "error-title";

  const label = document.createElement("span");
  label.textContent = `⚠ ${message[0]}`;

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Stäng felmeddelandet");

  title.append(label, close);

  const body = document.createElement("div");
  body.className = "error-body";

  const symbol = document.createElement("span");
  symbol.className = "error-symbol";
  symbol.textContent = "❌";

  const text = document.createElement("div");
  text.className = "error-text";

  const code = document.createElement("strong");
  code.textContent =
    `ERROR 0x${(4096 + index * 37).toString(16).toUpperCase()}`;

  const description = document.createElement("span");
  description.textContent = message[1];

  text.append(code, description);
  body.append(symbol, text);

  const actions = document.createElement("div");
  actions.className = "error-actions";

  const ok = document.createElement("button");
  ok.type = "button";
  ok.textContent = "OK";
  actions.append(ok);

  box.append(title, body, actions);
  desktop.append(box);

  function dismiss() {
    box.remove();
    playTone(360, 0.08);
  }

  close.addEventListener("click", dismiss);
  ok.addEventListener("click", dismiss);
}

function startChaos() {
  if (chaosStarted) return;
  chaosStarted = true;

  cardWindow.classList.add("hidden");
  updateScreen.classList.remove("hidden");

  showToast("⚠️ Halloween-uppdatering startar...");
  playTone(260, 0.3);

  const updateMessages = [
    "Kontrollerar spökfiler...",
    "Installerar pumpauppdateringar...",
    "Startar om spöksystemet..."
  ];

  const percent = $("updatePercent");
  let step = 0;

  const progressTimer = setInterval(() => {
    if (step < updateMessages.length) {
      percent.textContent = updateMessages[step];
      playTone(440 + step * 80, 0.12);
      step++;
    } else {
      clearInterval(progressTimer);
    }
  }, 650);

  chaosTimers.push(progressTimer);

  chaosTimers.push(setTimeout(() => {
    updateScreen.classList.add("hidden");
    playSpookySound();

    errors.forEach((message, index) => {
      chaosTimers.push(setTimeout(() => {
        createError(message, index);
        playTone(index % 2 === 0 ? 620 : 420, 0.15);

        if (index === errors.length - 1) {
          showToast(
            "👻 15 fejkade fel! Stäng dem med × eller OK."
          );
        }
      }, index * 220));
    });
  }, 2500));
}

$("closeCard").addEventListener("click", startChaos);

function updateClock() {
  const now = new Date();

  $("clock").textContent = new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(now);

  $("date").textContent = new Intl.DateTimeFormat("sv-SE", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(now);
}

updateClock();
setInterval(updateClock, 1000);

$("startButton").addEventListener("click", () => {
  chaosTimers.forEach((timer) => {
    clearTimeout(timer);
    clearInterval(timer);
  });
  chaosTimers = [];

  desktop.querySelectorAll(".error-window").forEach((box) => {
    box.remove();
  });

  document.querySelectorAll(".window").forEach((win) => {
    win.classList.add("hidden");
  });

  updateScreen.classList.add("hidden");
  toast.classList.add("hidden");
  chaosStarted = false;

  showToast("🎃 Skrivbordet är återställt!");
});
