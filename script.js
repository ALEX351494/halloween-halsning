
"use strict";

const $ = (id) => document.getElementById(id);

const desktop = $("desktop");
const cardWindow = $("cardWindow");
const updateScreen = $("updateScreen");
const blackout = $("blackout");
const ghostScene = $("ghostScene");
const toast = $("toast");

let audioContext = null;
let chaosStarted = false;
let restartInProgress = false;
let toastTimer = null;
let sequenceTimers = [];

const errorMessages = [
  ["VIRUS DETECTED", "Ett spöke har tagit sig in i systemet!"],
  ["ERROR 404", "Godiset kunde inte hittas."],
  ["CRITICAL WARNING", "Ovanlig aktivitet i spökvärlden."],
  ["UPDATE FAILED", "Pumpauppdateringen misslyckades."],
  ["SYSTEM ERROR", "En häxa har ändrat dina inställningar."],
  ["ERROR 666", "Mystisk Halloween-aktivitet upptäckt."],
  ["VIRUS DETECTED", "En zombie knackar på systemdörren."],
  ["CONNECTION LOST", "Kontakt med spökvärlden förlorad."],
  ["FATAL ERROR", "För många spöken i minnet."],
  ["UPDATE REQUIRED", "Uppdatera ditt spökskydd."],
  ["WARNING", "Fladdermöss har upptäckts på skrivbordet."],
  ["SYSTEM ALERT", "Något rör sig i bakgrunden."],
  ["ERROR 13", "Den svarta katten har korsat systemet."],
  ["UPDATE FAILED", "Häxkvasten kunde inte uppdateras."],
  ["VIRUS DETECTED", "Ett osynligt spöke har hittats."],
  ["MEMORY WARNING", "För många kusliga minnen."],
  ["SYSTEM ERROR", "Datorn har blivit hemsökt."],
  ["UNKNOWN DEVICE", "Okänd enhet: spökdetektor."],
  ["SECURITY ALERT", "Någon knackar från andra sidan."],
  ["ERROR 31", "Pumpan svarar inte."],
  ["FATAL WARNING", "Spöken blockerar systemet."],
  ["UPDATE REQUIRED", "Installera nattens mörker."],
  ["UNKNOWN ERROR", "Vi vet inte vad som hände... 👻"],
  ["SYSTEM WARNING", "Ditt skrivbord verkar leva."],
  ["FINAL ERROR", "Du borde nog inte ha öppnat brevet."]
];

function playTone(frequency = 440, duration = 0.18, volume = 0.045) {
  const AudioClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioClass) return;

  try {
    audioContext ??= new AudioClass();

    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      frequency,
      audioContext.currentTime
    );

    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      volume,
      audioContext.currentTime + 0.025
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime + duration
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    console.warn("Ljudet kunde inte spelas upp.", error);
  }
}

function playSpookySound() {
  playTone(155, 0.8, 0.035);
  schedule(() => playTone(196, 0.9, 0.035), 180);
  schedule(() => playTone(116, 1.1, 0.045), 400);
}

function playErrorSound(index) {
  playTone(index % 2 === 0 ? 740 : 520, 0.12, 0.025);
}

function schedule(callback, delay) {
  const timer = setTimeout(callback, delay);
  sequenceTimers.push(timer);
  return timer;
}

function cancelSequence() {
  sequenceTimers.forEach((timer) => {
    clearTimeout(timer);
    clearInterval(timer);
  });

  sequenceTimers = [];
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
  if (restartInProgress || chaosStarted) return;

  $(id).classList.remove("hidden");
  playTone(520, 0.1);
}

$("openCard").addEventListener("click", () => {
  openWindow("cardWindow");
  if (!chaosStarted && !restartInProgress) playSpookySound();
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
    playTone(330, 0.09);
  });
});

function createError(message, index) {
  const box = document.createElement("section");
  box.className = "error-window";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", message[0]);

  const width = Math.min(285, Math.max(220, desktop.clientWidth - 24));
  const maxX = Math.max(0, desktop.clientWidth - width);

  // Håll felrutorna ovanför aktivitetsfältet.
  const maxY = Math.max(80, desktop.clientHeight - 245);
  const x = Math.random() * maxX;
  const y = 12 + Math.random() * Math.max(0, maxY - 12);

  box.style.left = `${x}px`;
  box.style.top = `${y}px`;

  const title = document.createElement("div");
  title.className = "error-title";

  const heading = document.createElement("span");
  heading.textContent = `⚠ ${message[0]}`;

  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "×";
  close.setAttribute("aria-label", "Stäng felmeddelandet");

  title.append(heading, close);

  const body = document.createElement("div");
  body.className = "error-body";

  const symbol = document.createElement("span");
  symbol.className = "error-symbol";
  symbol.textContent = "❌";

  const text = document.createElement("div");
  text.className = "error-text";

  const code = document.createElement("strong");
  code.textContent =
    `ERROR 0x${(4096 + index * 53).toString(16).toUpperCase()}`;

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
    playTone(340, 0.08, 0.02);
  }

  close.addEventListener("click", dismiss);
  ok.addEventListener("click", dismiss);
}

function startChaos() {
  if (chaosStarted || restartInProgress) return;
  chaosStarted = true;

  cardWindow.classList.add("hidden");
  updateScreen.classList.remove("hidden");

  showToast("⚠️ Halloween-systemet uppdateras...");
  playSpookySound();

  const updateMessages = [
    "Söker efter spöken...",
    "Installerar pumpauppdateringar...",
    "Kontrollerar kusliga filer...",
    "Startar spöksystemet..."
  ];

  const label = $("updatePercent");
  let step = 0;

  const progressTimer = setInterval(() => {
    if (step >= updateMessages.length) {
      clearInterval(progressTimer);
      return;
    }

    label.textContent = updateMessages[step];
    playTone(420 + step * 65, 0.12, 0.025);
    step++;
  }, 550);

  sequenceTimers.push(progressTimer);

  schedule(() => {
    updateScreen.classList.add("hidden");

    errorMessages.forEach((message, index) => {
      schedule(() => {
        createError(message, index);
        playErrorSound(index);

        if (index === errorMessages.length - 1) {
          showToast(
            "👻 25 fejkade felmeddelanden! Stäng dem med × eller OK."
          );
        }
      }, index * 240);
    });
  }, 2400);
}

$("closeCard").addEventListener("click", startChaos);

function startRestart() {
  if (restartInProgress) return;

  restartInProgress = true;
  cancelSequence();
  clearTimeout(toastTimer);

  desktop.querySelectorAll(".error-window").forEach((box) => {
    box.remove();
  });

  document.querySelectorAll(".window").forEach((win) => {
    win.classList.add("hidden");
  });

  updateScreen.classList.add("hidden");
  toast.classList.add("hidden");
  ghostScene.classList.add("hidden");

  blackout.classList.remove("hidden");
  playTone(95, 0.7, 0.035);

  // Först helt svart. Sedan kommer spöket.
  schedule(() => {
    ghostScene.classList.remove("hidden");
    playSpookySound();
  }, 1800);
}

$("restartButton").addEventListener("click", startRestart);

$("returnDesktop").addEventListener("click", () => {
  cancelSequence();

  blackout.classList.add("hidden");
  ghostScene.classList.add("hidden");

  chaosStarted = false;
  restartInProgress = false;

  desktop.querySelectorAll(".error-window").forEach((box) => {
    box.remove();
  });

  showToast("🎃 Skrivbordet är tillbaka...");
  playTone(480, 0.15);
});

$("startButton").addEventListener("click", () => {
  if (restartInProgress) return;

  document.querySelectorAll(".window").forEach((win) => {
    win.classList.add("hidden");
  });

  showToast("🎃 Halloween OS är redo.");
  playTone(500, 0.1);
});

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
