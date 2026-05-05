const routineTitle = document.getElementById("routine-title");
const heroRoutineTitle = document.getElementById("hero-routine-title");
const heroRoutineIntro = document.getElementById("hero-routine-intro");
const routineIntent = document.getElementById("routine-intent");
const routineNeutralNote = document.getElementById("routine-neutral-note");
const selectorWrap = document.getElementById("selector-wrap");
const segmentButtons = document.querySelectorAll(".segment-button");
const revealNodes = document.querySelectorAll(".reveal");
const trackedThankYouEvents = new Set();

const routineProfiles = {
  simpatica: {
    title: "Rutina de 5 minutos: bajar del modo alerta (simpático en sobrecarga)",
    intent: "Objetivo: ayudar a tu sistema a sentir seguridad y volver a un ritmo más estable.",
  },
  freeze: {
    title: "Rutina de 5 minutos: salir de la congelación con suavidad (modo freeze)",
    intent: "Objetivo: ayudar a tu sistema a sentir seguridad y volver a un ritmo más estable.",
  },
  mixta: {
    title: "Rutina de 5 minutos: regular una respuesta mixta (sube y baja)",
    intent: "Objetivo: ayudar a tu sistema a sentir seguridad y volver a un ritmo más estable.",
  },
};

function getSelectedType() {
  const params = new URLSearchParams(window.location.search);
  return params.get("tipo");
}

function trackEvent(eventName, payload = {}) {
  if (typeof window.va === "function") {
    window.va("event", {
      name: eventName,
      data: payload,
    });
    return;
  }

  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  window.dataLayer.push({ event: eventName, ...payload });
}

function trackOnce(eventName, payload = {}) {
  const cacheKey = `${eventName}:${JSON.stringify(payload)}`;
  if (trackedThankYouEvents.has(cacheKey)) {
    return;
  }

  trackedThankYouEvents.add(cacheKey);
  trackEvent(eventName, payload);
}

function applyRoutine(type, fromQuery) {
  const profile = routineProfiles[type] || routineProfiles.mixta;
  const resolvedType = routineProfiles[type] ? type : "mixta";

  routineTitle.textContent = profile.title;
  heroRoutineTitle.textContent = profile.title;
  heroRoutineIntro.textContent = profile.intent;
  routineIntent.textContent = profile.intent;

  if (fromQuery && routineProfiles[type]) {
    routineNeutralNote.hidden = true;
  } else {
    routineNeutralNote.hidden = false;
  }

  segmentButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.type === resolvedType);
  });

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set("tipo", resolvedType);
  window.history.replaceState({}, "", nextUrl);

  trackEvent(fromQuery ? "Routine Type Viewed" : "Routine Type Defaulted", {
    type: resolvedType,
  });
}

function setupSegments() {
  segmentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      trackEvent("Routine Type Switched", { type: button.dataset.type });
      applyRoutine(button.dataset.type, true);
    });
  });

  if (!selectorWrap) {
    return;
  }
}

function setupReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

applyRoutine(getSelectedType(), true);
setupSegments();
setupReveal();
trackOnce("Thank You Viewed", { page: "thank-you" });
