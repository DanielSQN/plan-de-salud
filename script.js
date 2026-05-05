const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const rotatingSubtitle = document.querySelector("[data-rotating-subtitle]");
const rotatingPlanSubtitle = document.querySelector("[data-plan-rotating-subtitle]");
const whatsappForm = document.querySelector("[data-whatsapp-form]");
const plansGrid = document.querySelector("[data-plans-grid]");
const whatsappNumber = "573188907425";

const startTypewriter = (element, options) => {
  let currentIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;

  const writeSpeed = 145;
  const deleteSpeed = 85;
  const holdAfterWrite = 2600;
  const holdAfterDelete = 450;

  const typeNextFrame = () => {
    const currentText = options[currentIndex];

    if (isDeleting) {
      characterIndex -= 1;
    } else {
      characterIndex += 1;
    }

    element.textContent = currentText.slice(0, characterIndex);

    if (!isDeleting && characterIndex === currentText.length) {
      isDeleting = true;
      window.setTimeout(typeNextFrame, holdAfterWrite);
      return;
    }

    if (isDeleting && characterIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % options.length;
      window.setTimeout(typeNextFrame, holdAfterDelete);
      return;
    }

    window.setTimeout(typeNextFrame, isDeleting ? deleteSpeed : writeSpeed);
  };

  element.textContent = "";
  window.setTimeout(typeNextFrame, 500);
};

const buildWhatsappUrl = (message) => (
  `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`
);

const formatCop = (value) => new Intl.NumberFormat("es-CO").format(Number(value));

const createPlanCard = (plan, index) => {
  const card = document.createElement("article");
  card.className = "plan-card";
  card.dataset.accent = String((index % 4) + 1);

  if (plan.recommended) {
    card.classList.add("is-recommended");

    const badge = document.createElement("span");
    badge.className = "plan-recommended-badge";
    badge.textContent = "Recomendado";
    card.append(badge);
  }

  const title = document.createElement("h3");
  title.textContent = plan.name;
  card.append(title);

  if (plan.priceFrom) {
    const priceWrap = document.createElement("div");
    priceWrap.className = "plan-price";

    const priceLabel = document.createElement("span");
    priceLabel.className = "plan-price-label";
    priceLabel.textContent = "Desde:";

    const priceValue = document.createElement("strong");
    priceValue.textContent = `$${formatCop(plan.priceFrom)}`;

    const priceUnit = document.createElement("span");
    priceUnit.className = "plan-price-unit";
    priceUnit.textContent = `/${plan.priceUnit || "mes"}`;

    priceWrap.append(priceLabel, priceValue, priceUnit);
    card.append(priceWrap);
  } else {
    const contactLabel = document.createElement("a");
    contactLabel.className = "plan-contact-label";
    contactLabel.href = buildWhatsappUrl(`Hola, quiero mas informacion sobre ${plan.name}.`);
    contactLabel.target = "_blank";
    contactLabel.rel = "noopener";
    contactLabel.textContent = "Contactanos para mas detalles";
    card.append(contactLabel);
  }

  const summary = document.createElement("p");
  summary.className = "plan-summary";
  summary.textContent = plan.summary;
  card.append(summary);

  if (Array.isArray(plan.features) && plan.features.length > 0) {
    const features = document.createElement("ul");
    features.className = "plan-features";

    plan.features.forEach((feature) => {
      const item = document.createElement("li");
      item.textContent = feature;
      features.append(item);
    });

    card.append(features);
  }

  const cta = document.createElement("a");
  cta.className = "button primary plan-card-cta";
  cta.href = buildWhatsappUrl(`Hola, quiero recibir mas informacion sobre el plan ${plan.name}, sus beneficios, coberturas y precios.`);
  cta.target = "_blank";
  cta.rel = "noopener";
  cta.textContent = "Ver todos los beneficios";
  card.append(cta);

  return card;
};

const renderPlans = async () => {
  if (!plansGrid) {
    return;
  }

  try {
    const response = await fetch(`data/planes.json?v=${Date.now()}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error("No se pudieron cargar los planes");
    }

    const plans = await response.json();
    plansGrid.replaceChildren(...plans.map(createPlanCard));
  } catch (error) {
    plansGrid.innerHTML = "";
    const message = document.createElement("p");
    message.className = "plans-loading";
    message.textContent = "No fue posible cargar los planes. Prueba abrir la pagina desde un servidor local o GitHub Pages.";
    plansGrid.append(message);
  }
};

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (rotatingSubtitle) {
  startTypewriter(rotatingSubtitle, ["Para ti", "SURA", "Colmedica", "AXA Colpatria", "Plus SURA"]);
}

if (rotatingPlanSubtitle) {
  startTypewriter(rotatingPlanSubtitle, [
    "Medicina Prepagada Sura",
    "Sura Premium",
    "Rubí Élite Colmédica",
    "AXA Colpatria",
  ]);
}

if (whatsappForm) {
  whatsappForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!whatsappForm.reportValidity()) {
      return;
    }

    const formData = new FormData(whatsappForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const message = [
      "Hola, Seal seguros Ltda.",
      "Quiero recibir asesoria para cotizar un plan de salud o medicina prepagada.",
      `Mi nombre es ${name} y mi telefono de contacto es ${phone}.`,
      "Me gustaria conocer las opciones disponibles, beneficios, cobertura y precios segun mi necesidad.",
      "Quedo atento(a) para que un asesor me contacte.",
    ].join(" ");
    const whatsappUrl = buildWhatsappUrl(message);

    window.open(whatsappUrl, "_blank", "noopener");
  });
}

renderPlans();
