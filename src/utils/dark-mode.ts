type Theme = 'light' | 'dark';

const themeContextKey = 'theme';
const prefersDarkThemeQuery = '(prefers-color-scheme: dark)';

const themes: Record<'light' | 'dark', Theme> = {
  dark: 'dark',
  light: 'light',
};

const prefersDarkTheme = () => window.matchMedia(prefersDarkThemeQuery).matches;

export const getTheme = (): Theme => {
  const preferredTheme: Theme = prefersDarkTheme() ? themes.dark : themes.light;
  const currentTheme: Theme =
    (localStorage.getItem(themeContextKey) as Theme) ?? preferredTheme;
  if (currentTheme === 'dark') document.body.classList.add('dark');
  return currentTheme;
};

export const setTheme = (theme: Theme) => {
  const currentTheme: Theme = localStorage.getItem(themeContextKey) as Theme;
  if (currentTheme === 'dark') {
    document.body.classList.remove('dark');
  } else {
    document.body.classList.add('dark');
  }
  localStorage.setItem(themeContextKey, theme);
};
