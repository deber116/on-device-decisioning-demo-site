const THEME_STORAGE_KEY = 'ashop-theme';

function isDarkTheme() {
  return typeof document !== 'undefined' &&
    document.documentElement.classList.contains('theme-dark');
}

function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return;
  }
  const dark = theme === 'dark';
  document.documentElement.classList.toggle('theme-dark', dark);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, dark ? 'dark' : 'light');
  } catch (err) {
    // The class still applies for this page when storage is unavailable.
  }
}

export { THEME_STORAGE_KEY, isDarkTheme, applyTheme };
