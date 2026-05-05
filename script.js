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
const quizQuestion = document.getElementById("quiz-question");
const quizOptions = document.getElementById("quiz-options");
const quizCounter = document.getElementById("quiz-counter");
const quizProgress = document.getElementById("quiz-progress");
const quizBack = document.getElementById("quiz-back");
const quizStageInner = document.getElementById("quiz-stage-inner");
const quizExperience = document.getElementById("quiz-experience");
const openQuizButtons = [
  document.getElementById("open-quiz-hero"),
  document.getElementById("open-quiz-section"),
  document.getElementById("open-quiz-sticky"),
].filter(Boolean);

const quizQuestions = [
  {
    question: "¿Cómo empieza tu día normalmente?",
    options: [
      { value: "simpatica", text: "Con la mente ya activa antes de levantarme, como si el cerebro no hubiera descansado" },
      { value: "freeze", text: "Con muchísimo esfuerzo. Me cuesta arrancar aunque haya dormido" },
      { value: "mixta", text: "Nunca sé cómo va a estar mi cuerpo hasta que me levanto" },
    ],
  },
  {
    question: "Alguien te dice \"relájate un momento.\" ¿Qué pasa?",
    options: [
      { value: "simpatica", text: "Lo intento pero mi mente sigue corriendo, no puedo simplemente \"apagar\"" },
      { value: "freeze", text: "Me desconecto fácil... quizás demasiado fácil" },
      { value: "mixta", text: "Depende del día. A veces puedo, a veces es imposible" },
    ],
  },
  {
    question: "¿Cómo describirías tu energía la mayor parte del tiempo?",
    options: [
      { value: "simpatica", text: "Alta pero tensa, como una cuerda que está demasiado estirada" },
      { value: "freeze", text: "Baja y pesada, como cargar con algo que no puedo soltar" },
      { value: "mixta", text: "Impredecible, sube y baja sin que yo entienda por qué" },
    ],
  },
  {
    question: "¿Y tu sueño?",
    options: [
      { value: "simpatica", text: "Me cuesta apagar la mente para dormir, o me despierto en la madrugada con el cerebro activo" },
      { value: "freeze", text: "Podría dormir todo el día y aún así sentirme agotado/a" },
      { value: "mixta", text: "Algunos días duermo bien y otros es un desastre, sin patrón claro" },
    ],
  },
  {
    question: "Cuando algo te estresa, ¿qué hace tu cuerpo?",
    options: [
      { value: "simpatica", text: "Se tensa. Mandíbula apretada, hombros subidos, corazón acelerado" },
      { value: "freeze", text: "Se apaga. Me bloqueo, me quedo sin palabras, me desconecto" },
      { value: "mixta", text: "A veces explota y otras veces simplemente... no reacciona" },
    ],
  },
  {
    question: "¿Cómo es tu concentración?",
    options: [
      { value: "simpatica", text: "Mi mente va tan rápido que salto de una cosa a otra sin terminar nada" },
      { value: "freeze", text: "Me siento lento/a, como si hubiera neblina entre mis pensamientos y las acciones" },
      { value: "mixta", text: "Inconsistente. Hay días que fluyo y días que no puedo ni empezar" },
    ],
  },
  {
    question: "Al final del día...",
    options: [
      { value: "simpatica", text: "Estoy agotado/a pero no puedo desconectarme. Mi cuerpo quiere parar pero mi mente no" },
      { value: "freeze", text: "Solo quiero desaparecer. No tengo energía ni para una conversación" },
      { value: "mixta", text: "Nunca sé cómo voy a terminar. Es un misterio hasta que llega la noche" },
    ],
  },
  {
    question: "Si tu cuerpo pudiera hablar en este momento, ¿qué diría?",
    options: [
      { value: "simpatica", text: "No puedo parar aunque quiera" },
      { value: "freeze", text: "Ya no tengo nada que dar" },
      { value: "mixta", text: "No sé ni cómo estoy" },
    ],
  },
];

let currentQuestionIndex = 0;
let quizAnswers = [];

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

function scoreQuiz(answers) {
  const scores = {
    simpatica: 0,
    freeze: 0,
    mixta: 0,
  };

  answers.forEach((value) => {
    if (value && Object.prototype.hasOwnProperty.call(scores, value)) {
      scores[value] += 1;
    }
  });

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function renderProgress() {
  quizProgress.innerHTML = "";
  quizQuestions.forEach((_, index) => {
    const step = document.createElement("span");
    step.className = "quiz-progress-step";
    if (index < currentQuestionIndex) {
      step.classList.add("is-complete");
    } else if (index === currentQuestionIndex) {
      step.classList.add("is-active");
    }
    quizProgress.appendChild(step);
  });
}

function renderQuestion() {
  const current = quizQuestions[currentQuestionIndex];
  quizCounter.textContent = `Pregunta ${currentQuestionIndex + 1} de ${quizQuestions.length}`;
  quizQuestion.textContent = current.question;
  quizOptions.innerHTML = "";

  current.options.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = option.text;
    button.addEventListener("click", () => {
      quizAnswers[currentQuestionIndex] = option.value;

      if (currentQuestionIndex === quizQuestions.length - 1) {
        const resultType = scoreQuiz(quizAnswers);
        trackEvent("Quiz Completed", { result: resultType });
        renderQuizResult(resultType);
        return;
      }

      currentQuestionIndex += 1;
      transitionToQuestion();
    });
    quizOptions.appendChild(button);
  });

  quizBack.style.visibility = currentQuestionIndex === 0 ? "hidden" : "visible";
}

function transitionToQuestion() {
  quizStageInner.classList.add("is-sliding");
  window.setTimeout(() => {
    renderProgress();
    renderQuestion();
    quizStageInner.classList.remove("is-sliding");
  }, 180);
}

function startQuiz() {
  if (quizAnswers.length === 0) {
    currentQuestionIndex = 0;
    quizAnswers = [];
  }
  renderProgress();
  renderQuestion();
  quizExperience.scrollIntoView({ behavior: "smooth", block: "start" });
  trackEvent("Quiz Started", { source: "embedded" });
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

openQuizButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    quizStatus.textContent = "";
    startQuiz();
  });
});

quizBack?.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex -= 1;
    transitionToQuestion();
  }
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
renderProgress();
renderQuestion();
trackOnce("Optin Page Viewed", { page: "quiz-first-optin" });
