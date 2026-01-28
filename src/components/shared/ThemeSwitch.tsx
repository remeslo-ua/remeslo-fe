'use client';

import { useTheme } from '@/providers/ThemeProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

export const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      <FontAwesomeIcon
        icon={theme === 'light' ? faMoon : faSun}
        className="w-5 h-5 text-gray-700 dark:text-gray-200"
      />
    </button>
  );
};
