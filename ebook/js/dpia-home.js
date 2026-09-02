(() => {
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const header = document.querySelector('[data-header]');

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  if (header) {
    const setScrolledState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    setScrolledState();
    window.addEventListener('scroll', setScrolledState, { passive: true });
  }

  const priorityForm = document.querySelector('[data-priority-form]');
  const formStatus = document.querySelector('[data-form-status]');

  if (priorityForm && formStatus) {
    priorityForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const firstName = new FormData(priorityForm).get('first-name');
      formStatus.textContent = `Thank you${firstName ? `, ${firstName}` : ''}. You’re on the priority list.`;
      priorityForm.reset();
    });
  }
})();
