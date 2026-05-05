const quizStatus = document.getElementById("quiz-status");
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

function transitionToQuestion() {
  quizStageInner.classList.add("is-sliding");
  window.setTimeout(() => {
    renderProgress();
    renderQuestion();
    quizStageInner.classList.remove("is-sliding");
  }, 180);
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
        window.location.href = resultsPageUrl(resultType);
        return;
      }

      currentQuestionIndex += 1;
      transitionToQuestion();
    });
    quizOptions.appendChild(button);
  });

  quizBack.style.visibility = currentQuestionIndex === 0 ? "hidden" : "visible";
}

function startQuiz(source) {
  quizExperience.hidden = false;
  currentQuestionIndex = 0;
  quizAnswers = [];
  quizStatus.textContent = "Tu quiz está listo.";
  renderProgress();
  renderQuestion();
  quizExperience.scrollIntoView({ behavior: "smooth", block: "start" });
  trackEvent("Quiz Started", { source });
}

function resultsPageUrl(type) {
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
    const source = button.id || "quiz-trigger";
    startQuiz(source);
  });
});

quizBack?.addEventListener("click", () => {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex -= 1;
    transitionToQuestion();
  }
});

setupReveal();
setupCTAEvents();
trackOnce("Optin Page Viewed", { page: "quiz-landing" });
