'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const ThemeSwitcher = () => {
  const [theme, setTheme] = useState('');

  useEffect(() => {
    if (theme === 'alt') {
      document.documentElement.classList.add('alt_theme');
    } else {
      document.documentElement.classList.remove('alt_theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'alt' ? '' : 'alt');
  };

  return (
    <button className='p-3' onClick={toggleTheme}>
      <FontAwesomeIcon icon={theme === 'alt' ? faMoon : faSun} />
    </button>
  );
};

export default ThemeSwitcher;