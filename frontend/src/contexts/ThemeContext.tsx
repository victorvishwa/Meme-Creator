import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => { },
});

export const useTheme = () => useContext(ThemeContext);

const lightTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#6366f1',
        },
        secondary: {
            main: '#ec4899',
        },
        background: {
            default: '#f8fafc',
            paper: 'rgba(255, 255, 255, 0.8)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                    backgroundAttachment: 'fixed',
                },
            },
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#818cf8',
        },
        secondary: {
            main: '#f472b6',
        },
        background: {
            default: '#0f172a',
            paper: 'rgba(30, 41, 59, 0.8)',
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    backgroundAttachment: 'fixed',
                },
            },
        },
    },
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
    });

    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <MuiThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                <CssBaseline />
                {children}
            </MuiThemeProvider>
        </ThemeContext.Provider>
    );
}; 