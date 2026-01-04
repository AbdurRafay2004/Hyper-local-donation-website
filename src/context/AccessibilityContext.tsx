import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

interface AccessibilityContextType {
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void;
    colorBlindMode: ColorBlindMode;
    setColorBlindMode: (mode: ColorBlindMode) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
        const saved = localStorage.getItem('accessibility-dark-mode');
        return saved ? JSON.parse(saved) : false;
    });

    const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>(() => {
        const saved = localStorage.getItem('accessibility-colorblind-mode');
        return (saved as ColorBlindMode) || 'none';
    });

    // Apply color blind mode filter
    useEffect(() => {
        const root = document.documentElement;

        // Remove all color blind classes
        root.classList.remove('protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia');

        // Apply selected mode
        if (colorBlindMode !== 'none') {
            root.classList.add(colorBlindMode);
        }

        // Save to localStorage
        localStorage.setItem('accessibility-colorblind-mode', colorBlindMode);
    }, [colorBlindMode]);

    // Apply dark mode
    useEffect(() => {
        const root = document.documentElement;

        if (isDarkMode) {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }

        localStorage.setItem('accessibility-dark-mode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    return (
        <AccessibilityContext.Provider
            value={{
                isDarkMode,
                setIsDarkMode,
                colorBlindMode,
                setColorBlindMode,
            }}
        >
            {children}
        </AccessibilityContext.Provider>
    );
};

export const useAccessibility = () => {
    const context = useContext(AccessibilityContext);
    if (context === undefined) {
        throw new Error('useAccessibility must be used within an AccessibilityProvider');
    }
    return context;
};
