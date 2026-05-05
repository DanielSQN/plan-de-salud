const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const rotatingSubtitle = document.querySelector("[data-rotating-subtitle]");

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
  const options = ["Para ti", "SURA", "Colmedica", "AXA Colpatria", "Plus SURA"];
  let currentIndex = 0;

  rotatingSubtitle.textContent = options[currentIndex];

  window.setInterval(() => {
    currentIndex = (currentIndex + 1) % options.length;
    rotatingSubtitle.classList.add("is-changing");

    window.setTimeout(() => {
      rotatingSubtitle.textContent = options[currentIndex];
      rotatingSubtitle.classList.remove("is-changing");
    }, 180);
  }, 3000);
}
