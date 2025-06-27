import { setTheme, getTheme } from '@/dark-mode';

document.onload = () => {
  setTheme(getTheme());
};
