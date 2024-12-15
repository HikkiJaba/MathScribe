import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkTheme, setIsDarkTheme] = useState(
        localStorage.getItem('theme') === 'dark'
    );

    useEffect(() => {
        // Сохраняем тему в localStorage
        localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light');
        
        // Применяем атрибут к body для более широких стилей
        document.body.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    }, [isDarkTheme]);

    const toggleTheme = () => {
        setIsDarkTheme(prevTheme => !prevTheme);
    };

    return (
        <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);