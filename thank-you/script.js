const resultTitle = document.getElementById("result-title");
const resultStateBanner = document.getElementById("result-state-banner");
const resultStateLine = document.getElementById("result-state-line");
const resultStateIcon = document.getElementById("result-state-icon");
const resultParagraph1 = document.getElementById("result-paragraph-1");
const resultParagraph2 = document.getElementById("result-paragraph-2");
const resultParagraph3 = document.getElementById("result-paragraph-3");
const resultParagraph4 = document.getElementById("result-paragraph-4");
const resultReassuranceTitle = document.getElementById("result-reassurance-title");
const resultReassuranceCopy = document.getElementById("result-reassurance-copy");
const resultModeBadge = document.getElementById("result-mode-badge");
const resultModeIcon = document.getElementById("result-mode-icon");
const resultModeText = document.getElementById("result-mode-text");
const resultPortraitMain = document.getElementById("result-portrait-main");
const resultPortraitSecondary = document.getElementById("result-portrait-secondary");
const symptomGrid = document.getElementById("symptom-grid");
const protocolTitle = document.getElementById("protocol-title");
const protocolCopy = document.getElementById("protocol-copy");
const protocolList = document.getElementById("protocol-list");
const quizResultField = document.getElementById("quiz-result-field");
const formStatus = document.getElementById("form-status");
const submitButton = document.getElementById("submit-button");
const leadForm = document.getElementById("lead-form");
const revealNodes = document.querySelectorAll(".reveal");
const trackedEvents = new Set();

const resultProfiles = {
  acelerado: {
    slug: "acelerado",
    title: "El Acelerado",
    stateLine: "Tu sistema nervioso está en modo alerta.",
    stateIcon: "⚡",
    paragraphs: [
      "Tu mente no para, tu cuerpo tampoco, incluso cuando estás quieto hay una tensión que no termina de soltarse.",
      "Duermes mal, te cuesta desconectarte al final del día, y sientes que estás funcionando a un ritmo que no es sostenible.",
      "No es ansiedad de carácter. Es tu sistema nervioso atascado en un estado de activación que no sabe cómo apagar.",
      "Tiene solución, y empieza por entender exactamente qué necesita tu cuerpo para regularse.",
    ],
    reassuranceTitle: "No es ansiedad de carácter.",
    reassuranceCopy: "Es tu sistema nervioso atascado en un estado de activación que no sabe cómo apagar.",
    modeText: "Modo alerta",
    modeIcon: "⚡",
    mainImage: "../assets/result-acelerado-ref.png",
    secondaryImage: "",
    symptoms: [
      { icon: "◎", label: "Mente acelerada y pensamientos repetitivos." },
      { icon: "☾", label: "Dificultad para dormir o descanso poco reparador." },
      { icon: "ϟ", label: "Tensión muscular constante y cansancio que no se va." },
      { icon: "◔", label: "Irritabilidad, impaciencia y sobreestimulación." },
      { icon: "▣", label: "Sensación de estar siempre al límite, sin pausa." },
    ],
    protocolTitle: "Tu próximo paso: tu protocolo de reset personalizado",
    protocolCopy: "Responde a este resultado con un plan diseñado específicamente para ti y tu sistema nervioso.",
    protocolItems: [
      "Curso gratuito (4-5 videos)",
      "Técnicas específicas para tu perfil",
      "Guía descargable",
      "Acceso inmediato",
    ],
  },
  desconectado: {
    slug: "desconectado",
    title: "El Desconectado",
    stateLine: "Tu sistema nervioso está en modo de conservación.",
    stateIcon: "▣",
    paragraphs: [
      "Tu cuerpo no está cansado porque eres perezoso. Está cansado porque lleva demasiado tiempo cargando más de lo que puede sostener, y en algún momento decidió apagar para protegerte.",
      "El problema es que ese modo de protección no distingue entre el estrés que ya pasó y el estrés de hoy. Tu sistema nervioso sigue en modo de conservación aunque ya no haya peligro real.",
      "Por eso no alcanza con descansar. Por eso la motivación no llega aunque la busques. Por eso hay días en que levantarte ya es demasiado.",
      "No estás roto. Estás protegido. Y hay una forma muy específica de despertar tu sistema nervioso sin forzarlo, sin agotarte más en el intento.",
    ],
    reassuranceTitle: "No estás roto. Estás protegido.",
    reassuranceCopy: "Y hay una forma muy específica de despertar tu sistema nervioso sin forzarlo, sin agotarte más en el intento.",
    modeText: "Modo conservación",
    modeIcon: "▣",
    mainImage: "../assets/result-desconectado-ref.png",
    secondaryImage: "",
    symptoms: [
      { icon: "◌", label: "Mente nublada y dificultad para concentrarte." },
      { icon: "▣", label: "Cansancio que no mejora, ni descansando." },
      { icon: "↓", label: "Desmotivación y sensación de estancamiento." },
      { icon: "☁", label: "Emociones pesadas, irritabilidad o apatía." },
      { icon: "◔", label: "Necesidad de aislarte y sensación de no poder más." },
    ],
    protocolTitle: "Tu próximo paso: tu protocolo de reset personalizado",
    protocolCopy: "Con tu resultado, creamos un plan diseñado específicamente para ti y tu sistema nervioso.",
    protocolItems: [
      "Curso gratuito (4-5 videos)",
      "Técnicas específicas para tu perfil",
      "Guía descargable",
      "Acceso inmediato",
    ],
  },
  inestable: {
    slug: "inestable",
    title: "El Inestable",
    stateLine: "Tu sistema nervioso está en modo de vaivén.",
    stateIcon: "~",
    paragraphs: [
      "Un día tienes energía, claridad, ganas de comerte el mundo. Al siguiente no puedes ni responder un mensaje.",
      "Y lo más agotador no es el vaivén en sí, es no saber cuál de los dos va a ser mañana.",
      "Tu sistema nervioso no es impredecible por capricho. Está recibiendo señales contradictorias y haciendo lo único que sabe hacer con eso, alternar entre activarse al máximo y apagarse por completo para recuperarse. Es un ciclo. Y mientras no se interrumpa, se repite.",
      "No necesitas más fuerza de voluntad. No necesitas ser más consistente. Necesitas que tu sistema nervioso encuentre un punto de equilibrio desde el que pueda operar sin colapsar. Eso es exactamente lo que tu protocolo está diseñado para hacer.",
    ],
    reassuranceTitle: "No necesitas más fuerza de voluntad.",
    reassuranceCopy: "Necesitas que tu sistema nervioso encuentre un punto de equilibrio desde el que pueda operar sin colapsar.",
    modeText: "Modo vaivén",
    modeIcon: "~",
    mainImage: "../assets/reference-hero.png",
    secondaryImage: "../assets/result-inestable-ref.png",
    symptoms: [
      { icon: "↕", label: "Cambios bruscos de ánimo, energía y motivación." },
      { icon: "◌", label: "Pensamientos acelerados seguidos de mente en blanco." },
      { icon: "▣", label: "Picos de productividad seguidos de agotamiento total." },
      { icon: "◎", label: "Sensación de estar “bien” y “mal” sin causa aparente." },
      { icon: "♡", label: "Dificultad para mantener rutinas o compromisos." },
    ],
    protocolTitle: "Tu próximo paso: tu protocolo de reset personalizado",
    protocolCopy: "Con tu resultado, creamos un plan diseñado específicamente para ti y tu sistema nervioso.",
    protocolItems: [
      "Curso gratuito (4-5 videos)",
      "Técnicas específicas para tu perfil",
      "Guía descargable",
      "Acceso inmediato",
    ],
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
  setError("email-error", "");

  const name = leadForm.elements.name?.value.trim() || "";
  const email = leadForm.elements.email?.value.trim() || "";
  let valid = true;

  if (!name) {
    setError("name-error", "Por favor, escribe tu nombre.");
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

function renderSymptoms(items) {
  symptomGrid.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "symptom-card";
    card.innerHTML = `
      <div class="symptom-icon">${item.icon}</div>
      <p>${item.label}</p>
    `;
    symptomGrid.appendChild(card);
  });
}

function renderProtocolItems(items) {
  protocolList.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    protocolList.appendChild(li);
  });
}

function applyResult(type) {
  const profile = resultProfiles[type] || resultProfiles.inestable;

  resultTitle.textContent = profile.title;
  resultStateBanner.dataset.profile = profile.slug;
  resultStateLine.textContent = profile.stateLine;
  resultStateIcon.textContent = profile.stateIcon;
  resultParagraph1.textContent = profile.paragraphs[0];
  resultParagraph2.textContent = profile.paragraphs[1];
  resultParagraph3.textContent = profile.paragraphs[2];
  resultParagraph4.textContent = profile.paragraphs[3];
  resultReassuranceTitle.textContent = profile.reassuranceTitle;
  resultReassuranceCopy.textContent = profile.reassuranceCopy;
  resultModeIcon.textContent = profile.modeIcon;
  resultModeText.textContent = profile.modeText;
  protocolTitle.textContent = profile.protocolTitle;
  protocolCopy.textContent = profile.protocolCopy;
  quizResultField.value = profile.slug;

  resultModeBadge.dataset.profile = profile.slug;
  resultPortraitMain.style.backgroundImage = `url("${profile.mainImage}")`;

  if (profile.secondaryImage) {
    resultPortraitSecondary.hidden = false;
    resultPortraitSecondary.style.backgroundImage = `url("${profile.secondaryImage}")`;
  } else {
    resultPortraitSecondary.hidden = true;
    resultPortraitSecondary.style.backgroundImage = "";
  }

  renderSymptoms(profile.symptoms);
  renderProtocolItems(profile.protocolItems);

  trackEvent("Result Viewed", { type: profile.slug });
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

leadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!validateLeadForm()) {
    return;
  }

  formStatus.textContent = "Enviando tu acceso...";
  leadForm.classList.add("is-loading");
  submitButton.textContent = "Enviando...";

  const payload = {
    name: leadForm.elements.name.value.trim(),
    email: leadForm.elements.email.value.trim(),
    nervous_system_state: leadForm.elements.quiz_result.value || "inestable",
    quiz_optin: true,
  };

  trackEvent("Course Optin Submitted", { result: payload.nervous_system_state });

  try {
    const response = await fetch("/api/lead", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo enviar el lead.");
    }

    window.location.href = data.redirectUrl;
  } catch (error) {
    console.error(error);
    formStatus.textContent = "No pudimos enviar tu acceso. Inténtalo otra vez.";
    leadForm.classList.remove("is-loading");
    submitButton.textContent = "Enviarme mi protocolo";
  }
});

applyResult(getSelectedType());
setupReveal();
trackOnce("Thank You Viewed", { page: "quiz-results-v3" });
