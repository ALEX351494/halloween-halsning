
const $ = (id) => document.getElementById(id);

const desktop = $("desktop");
const cardWindow = $("cardWindow");
const updateScreen = $("updateScreen");
const toast = $("toast");

let audioContext = null;
let chaosStarted = false;
let toastTimer;
let sequenceTimer;

const errors = [
  ["VIRUS DETECTED", "Ett spöke har hittat in i datorn!"],
  ["UPDATE FAILED", "Pumpauppdateringen misslyckades."],
  ["ERROR 404", "Det efterfrågade godiset saknas."],
  ["CRITICAL ERROR", "För många spöken i systemet!"],
  ["WARNING", "En fladdermus har tagit över skrivbordet."],
  ["SYSTEM ALERT", "Tangentbordet är hemsökt."],
  ["UPDATE REQUIRED", "Installera fler Halloween-pumpor."],
  ["ERROR 666", "Mystisk aktivitet upptäckt!"],
  ["VIRUS DETECTED", "En zombie har hittat dina filer."],
  ["CONNECTION LOST", "Kontakt med spökvärlden förlorad."],
  ["FATAL ERROR", "Spöket vägrar lämna datorn."],
  ["SYSTEM WARNING", "Fladdermöss upptäckta i systemet."],
  ["UPDATE FAILED", "Häxkvasten kunde inte uppdateras."],
  ["ERROR", "Halloween-systemet har blivit för spöklikt."],
  ["FINAL WARNING", "Du har väckt alla 15 spöken!"]
];

// Skapa ljud direkt i webbläsaren.
function getAudio() {
  const AudioClass =
    window.AudioContext || window.webkitAudioContext;

  if (!AudioClass) return null;

  if (!audioContext) {
    audioContext = new AudioClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }

  return audioContext;
}

// Ett kort elektroniskt uppdateringsljud.
function playUpdateSound(index = 0) {
  const audio = getAudio();
  if (!audio) return;

  const oscillator = audio.createOscillator();
  const gain = audio.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(
    index % 2 === 0 ? 660 : 440,
    audio.currentTime
  );
  oscillator.frequency.setValueAtTime(
    index % 2 === 0 ? 440 : 660,
    audio.currentTime + 0.1
  );

  gain.gain.setValueAtTime(0.0001, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.12,
    audio.currentTime + 0.02
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audio.currentTime + 0.22
  );

  oscillator.connect(gain);
  gain.connect(audio.destination);

  oscillator.start();
  oscillator.stop(audio.currentTime + 0.23);
}

// Lite kuslig, låg ton.
function playSpookySound() {
  const audio = getAudio();
  if (!audio) return;

  [110, 146.83, 174.61].forEach((frequency) => {
    const oscillator = audio.createOscillator();
    const gain = audio.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(
      frequency,
      audio.currentTime
    );

    gain.gain.setValueAtTime(0.0001, audio.currentTime);
    gain.gain.exponentialRampToValueAtTime(
      0.045,
      audio.currentTime + 0.25
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audio.currentTime + 1.5
    );

    oscillator.connect(gain);
    gain.connect(audio.destination);

    oscillator.start();
    oscillator.stop(audio.currentTime + 1.55);
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("hidden");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add("hidden");
  }, 3000);
}

// Öppna Halloween-appen.
$("openCard").addEventListener("click", () => {
  cardWindow.classList.remove("hidden");
  playSpookySound();
});

// Stäng kortfönstret med X-knappen.
document.querySelectorAll("[data-close]").forEach((button) => {
  button.addEventListener("click", () => {
    $(button.dataset.close).classList.add("hidden");
  });
});

// Skapa ett fejkfel som bara finns på hemsidan.
function createError(message, index) {
  const box = document.createElement("section");
  box.className = "error-window";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", message[0]);

  const width = Math.min(280, desktop.clientWidth - 24);
  const height = 160;
  const maxX = Math.max(0, desktop.clientWidth - width);
  const maxY = Math.max(
    0,
    desktop.clientHeight - height - 55
  );

  box.style.left = `${Math.random() * maxX}px`;
  box.style.top = `${Math.random() * maxY}px`;

  const title = document.createElement("div");
  title.className = "error-title";

  const titleText = document.createElement("span");
  titleText.textContent = `⚠ ${message[0]}`;

  const xButton = document.createElement("button");
  xButton.type = "button";
  xButton.textContent = "×";
  xButton.setAttribute("aria-label", "Stäng felmeddelandet");

  title.append(titleText, xButton);

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

  const okButton = document.createElement("button");
  okButton.type = "button";
  okButton.textContent = "OK";

  actions.append(okButton);
  box.append(title, body, actions);

  const close = () => box.remove();

  xButton.addEventListener("click", close);
  okButton.addEventListener("click", close);

  desktop.append(box);
}

// Visa fejkad uppdatering och därefter exakt 15 fel.
function startChaos() {
  if (chaosStarted) return;

  chaosStarted = true;
  cardWindow.classList.add("hidden");
  updateScreen.classList.remove("hidden");

  playUpdateSound(0);
  showToast("⚠️ Mystiska uppdateringar startar...");

  sequenceTimer = setTimeout(() => {
    updateScreen.classList.add("hidden");
    playSpookySound();

    errors.forEach((message, index) => {
      setTimeout(() => {
        createError(message, index);
        playUpdateSound(index);

        if (index === errors.length - 1) {
          showToast(
            "👻 15 fejkade fel! Klicka OK eller × för att stänga dem."
          );
        }
      }, index * 180);
    });
  }, 2500);
}

$("closeCard").addEventListener("click", startChaos);

// Klockan nere i aktivitetsfältet.
function updateClock() {
  $("clock").textContent = new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date());
}

updateClock();
setInterval(updateClock, 1000);

// Startknappen återställer det virtuella skrivbordet.
$("startButton").addEventListener("click", () => {
  clearTimeout(sequenceTimer);
  clearTimeout(toastTimer);

  desktop.querySelectorAll(".error-window").forEach((box) => {
    box.remove();
  });

  cardWindow.classList.add("hidden");
  updateScreen.classList.add("hidden");
  toast.classList.add("hidden");

  chaosStarted = false;

  showToast("🎃 Skrivbordet har återställts!");
});
