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
  document.getElementById("open-quiz-inline"),
].filter(Boolean);

const quizQuestions = [
  {
    question: "Cuando tienes un momento libre e inesperado, ¿qué hace tu mente?",
    options: [
      { letter: "A", value: "acelerado", text: "Se llena de cosas pendientes, empieza a planear, no puede simplemente estar quieta" },
      { letter: "B", value: "desconectado", text: "Se queda en blanco, no tienes ganas de nada en particular, prefieres no pensar" },
      { letter: "C", value: "inestable", text: "Va de un lado al otro, a veces con ideas y energía, a veces completamente vacía" },
    ],
  },
  {
    question: "¿Cómo describirías tu energía a lo largo del día?",
    options: [
      { letter: "A", value: "acelerado", text: "Tensa y acelerada, como si siempre hubiera algo urgente aunque no lo haya" },
      { letter: "B", value: "desconectado", text: "Baja y pesada, cuesta arrancar y mantener el ritmo durante el día" },
      { letter: "C", value: "inestable", text: "Impredecible, hay momentos buenos pero no sabes cuánto van a durar" },
    ],
  },
  {
    question: "¿Cómo reacciona tu cuerpo cuando algo te estresa?",
    options: [
      { letter: "A", value: "acelerado", text: "Se tensa, el corazón se acelera, sientes que tienes que hacer algo de inmediato" },
      { letter: "B", value: "desconectado", text: "Se apaga, te desconectas, prefieres no lidiar con eso ahora" },
      { letter: "C", value: "inestable", text: "Depende del día, a veces reaccionas con mucha intensidad y otras veces no tienes ni energía para reaccionar" },
    ],
  },
  {
    question: "¿Cómo es tu sueño últimamente?",
    options: [
      { letter: "A", value: "acelerado", text: "Te cuesta apagar la mente para dormir, te despiertas en la noche o amaneces ya cansado" },
      { letter: "B", value: "desconectado", text: "Duermes mucho pero el descanso nunca es suficiente, sigues agotado aunque hayas dormido" },
      { letter: "C", value: "inestable", text: "Irregular, hay noches buenas y noches malas sin un patrón claro" },
    ],
  },
  {
    question: "Si tu cuerpo pudiera hablar ahora mismo, ¿qué diría?",
    options: [
      { letter: "A", value: "acelerado", text: "\"No puedo parar aunque quiera\"" },
      { letter: "B", value: "desconectado", text: "\"No tengo energía para nada\"" },
      { letter: "C", value: "inestable", text: "\"No sé qué me pasa, un día estoy bien y al otro no\"" },
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
    acelerado: 0,
    desconectado: 0,
    inestable: 0,
  };

  answers.forEach((value) => {
    if (value && Object.prototype.hasOwnProperty.call(scores, value)) {
      scores[value] += 1;
    }
  });

  const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  return sorted[0][0];
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
    button.innerHTML = `
      <span class="quiz-option-letter">${option.letter}</span>
      <span class="quiz-option-text">${option.text}</span>
    `;
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
  renderProgress();
  renderQuestion();
  quizExperience.scrollIntoView({ behavior: "smooth", block: "start" });
  trackEvent("Quiz Started", { source });
}

function resultsPageUrl(type) {
  const safeType = type || "inestable";

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
  document.querySelectorAll(".button").forEach((node) => {
    node.addEventListener("click", () => {
      trackEvent("CTA Clicked", { label: node.textContent.trim() });
    });
  });
}

openQuizButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
    startQuiz(button.id || "quiz-trigger");
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
trackOnce("Optin Page Viewed", { page: "quiz-landing-v2" });
