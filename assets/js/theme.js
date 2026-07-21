(() => {
  const toggle = document.querySelector('.theme-toggle');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const getSavedTheme = () => {
    try {
      return localStorage.getItem('theme');
    } catch (error) {
      return null;
    }
  };

  if (!toggle) return;

  const applyTheme = (theme) => {
    document.documentElement.dataset.theme = theme;
    toggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
  };

  applyTheme(document.documentElement.dataset.theme || 'light');

  toggle.addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      // The selected theme still applies for this page when storage is unavailable.
    }
  });

  systemTheme.addEventListener('change', (event) => {
    if (!getSavedTheme()) {
      applyTheme(event.matches ? 'dark' : 'light');
    }
  });
})();
