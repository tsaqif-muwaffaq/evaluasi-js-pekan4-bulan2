function applySavedTheme() {
  const isDark = localStorage.getItem('campuss:dark') === '1';
  if (isDark) {
    document.body.classList.add('dark');
  }
}

function setupThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const isDark = document.body.classList.contains('dark');
      localStorage.setItem('campuss:dark', isDark ? '1' : '0');
    });
  }
}

function setupHamburgerMenu() {
                                                                           const hamburgerBtn = document.querySelector('.hamburger-btn');
  const nav = document.querySelector('.site-nav');
  hamburgerBtn?.addEventListener('click', () => {
    nav?.classList.toggle('nav-open');
  });
}

// Initialize all functionalities
applySavedTheme();
setupThemeToggle();
setupHamburgerMenu();