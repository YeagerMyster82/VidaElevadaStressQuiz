const quizForm = document.getElementById("quiz-form");
const quizStatus = document.getElementById("quiz-status");
const resultSection = document.getElementById("result-section");
const courseSection = document.getElementById("course-section");
const resultHeading = document.getElementById("result-heading");
const resultLabel = document.getElementById("result-label");
const resultSummary = document.getElementById("result-summary");
const resultBody1 = document.getElementById("result-body-1");
const resultBody2 = document.getElementById("result-body-2");
const resultBody3 = document.getElementById("result-body-3");
const quizResultField = document.getElementById("quiz-result-field");

const leadForm = document.getElementById("lead-form");
const formStatus = document.getElementById("form-status");
const submitButton = document.getElementById("submit-button");
const revealItems = document.querySelectorAll(".reveal");
const trackedEvents = new Set();

const resultProfiles = {
  simpatica: {
    heading: "Tu sistema nervioso está funcionando desde sobrecarga simpática.",
    label: "Simpático en sobrecarga",
    summary:
      "Tu cuerpo podría estar viviendo en alerta constante, incluso cuando externamente todo parece “normal”.",
    body1:
      "Te cuesta apagar la mente, relajarte de verdad o sentir que descansas por completo. Tu sistema puede seguir funcionando como si hubiera una amenaza presente, aunque tú solo quieras calma.",
    body2:
      "Eso suele sentirse como tensión, irritabilidad, prisa interna, mandíbula apretada, problemas para dormir o una sensación de que estás “encendida/o” todo el tiempo.",
    body3:
      "La buena noticia es que cuando le das al cuerpo la señal correcta, puede empezar a salir de ese patrón. Por eso tu siguiente paso es una rutina breve y específica para ayudarte a bajar del modo alerta.",
  },
  freeze: {
    heading: "Tu sistema nervioso muestra señales de freeze o apagamiento.",
    label: "Modo freeze",
    summary:
      "Tu cuerpo puede estar respondiendo con desconexión, agotamiento o bloqueo como una forma de protección.",
    body1:
      "Cuando el sistema ha sostenido demasiado durante demasiado tiempo, a veces deja de empujar y empieza a bajar la energía. Eso no significa debilidad: muchas veces significa supervivencia.",
    body2:
      "Puede sentirse como cansancio profundo, lentitud, neblina mental, desmotivación o dificultad para arrancar incluso tareas pequeñas.",
    body3:
      "Tu siguiente paso no es exigirte más. Es darle al cuerpo una entrada suave, segura y reguladora. Por eso prepararnos una rutina breve y guiada puede ayudarte a empezar sin abrumarte.",
  },
  mixta: {
    heading: "Tu sistema nervioso muestra una respuesta mixta.",
    label: "Respuesta mixta",
    summary:
      "Parece que tu cuerpo oscila entre activación y colapso: días de intensidad, seguidos por días de agotamiento o desconexión.",
    body1:
      "A veces sientes que puedes con todo y otras veces no entiendes por qué te cuesta incluso empezar. No es falta de disciplina. Es un patrón de sube y baja en tu sistema.",
    body2:
      "Esto suele generar confusión, frustración e inconsistencia porque nunca sabes bien con qué versión de tu energía te vas a encontrar.",
    body3:
      "La rutina que te preparamos busca darle a tu sistema una señal más estable. El objetivo no es forzarte, sino ayudarte a salir de los extremos y encontrar un poco más de organización interna.",
  },
};

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
  if (trackedEvents.has(cacheKey)) {
    return;
  }

  trackedEvents.add(cacheKey);
  trackEvent(eventName, payload);
}

function setError(id, message) {
  const node = document.getElementById(id);
  if (node) {
    node.textContent = message;
  }
}

function validateLeadForm() {
  setError("name-error", "");
  setError("phone-error", "");
  setError("email-error", "");

  const name = leadForm.elements.name?.value.trim() || "";
  const phone = leadForm.elements.phone?.value.trim() || "";
  const email = leadForm.elements.email?.value.trim() || "";
  let valid = true;

  if (!name) {
    setError("name-error", "Por favor, escribe tu nombre.");
    valid = false;
  }

  if (!phone) {
    setError("phone-error", "Por favor, escribe tu teléfono.");
    valid = false;
  }

  if (!email) {
    setError("email-error", "Por favor, escribe tu email.");
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError("email-error", "Por favor, usa un email válido.");
    valid = false;
  }

  return valid;
}

function scoreQuiz(formData) {
  const scores = {
    simpatica: 0,
    freeze: 0,
    mixta: 0,
  };

  ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"].forEach((key) => {
    const value = formData.get(key);
    if (value && Object.prototype.hasOwnProperty.call(scores, value)) {
      scores[value] += 1;
    }
  });

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function renderQuizResult(type) {
  const profile = resultProfiles[type] || resultProfiles.mixta;

  resultHeading.textContent = profile.heading;
  resultLabel.textContent = profile.label;
  resultSummary.textContent = profile.summary;
  resultBody1.textContent = profile.body1;
  resultBody2.textContent = profile.body2;
  resultBody3.textContent = profile.body3;
  quizResultField.value = type;

  resultSection.hidden = false;
  courseSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function thankYouUrl(type) {
  const safeType = type || "mixta";

  if (window.location.protocol === "file:") {
    return `./thank-you/index.html?tipo=${safeType}`;
  }

  return `/thank-you/?tipo=${safeType}`;
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

  revealItems.forEach((item) => observer.observe(item));
}

function setupCTAEvents() {
  document.querySelectorAll(".button, .hero-jump").forEach((node) => {
    node.addEventListener("click", () => {
      trackEvent("CTA Clicked", { label: node.textContent.trim() });
    });
  });
}

quizForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  quizStatus.textContent = "";

  const formData = new FormData(quizForm);
  const resultType = scoreQuiz(formData);

  trackEvent("Quiz Completed", { result: resultType });
  renderQuizResult(resultType);
});

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateLeadForm()) {
    return;
  }

  formStatus.textContent = "Enviando...";
  leadForm.classList.add("is-loading");
  submitButton.textContent = "Enviando...";

  const payload = {
    name: leadForm.elements.name.value.trim(),
    phone: leadForm.elements.phone.value.trim(),
    email: leadForm.elements.email.value.trim(),
    quiz_optin: true,
    quiz_result: leadForm.elements.quiz_result.value || "mixta",
  };

  trackEvent("Course Optin Submitted", { result: payload.quiz_result });

  try {
    await new Promise((resolve) => setTimeout(resolve, 900));
    console.info("POST /api/lead", payload);
    window.location.href = thankYouUrl(payload.quiz_result);
  } catch (error) {
    console.error(error);
    formStatus.textContent = "No pudimos enviar tu acceso. Inténtalo otra vez.";
    leadForm.classList.remove("is-loading");
    submitButton.textContent = "Enviar mi rutina de 5 minutos";
  }
});

setupReveal();
setupCTAEvents();
trackOnce("Optin Page Viewed", { page: "quiz-first-optin" });
