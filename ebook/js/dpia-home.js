(() => {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const menu = document.querySelector("[data-menu]");
  const header = document.querySelector("[data-header]");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (header) {
    const setScrolledState = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    setScrolledState();
    window.addEventListener("scroll", setScrolledState, { passive: true });
  }
})();

const toolkitModal = document.querySelector("[data-toolkit-modal]");
const toolkitOpenTriggers = document.querySelectorAll(
  "[data-toolkit-modal-open]",
);
const toolkitCloseTriggers = document.querySelectorAll(
  "[data-toolkit-modal-close]",
);

if (toolkitModal) {
  const openModal = () => {
    toolkitModal.classList.add("is-open");
    toolkitModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("toolkit-modal-open");
  };

  const closeModal = () => {
    toolkitModal.classList.remove("is-open");
    toolkitModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("toolkit-modal-open");
  };

  toolkitOpenTriggers.forEach((trigger) => {
    trigger.addEventListener("click", openModal);
  });

  toolkitCloseTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toolkitModal.classList.contains("is-open")) {
      closeModal();
    }
  });
}
