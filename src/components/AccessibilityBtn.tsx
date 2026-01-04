import React, { useState, useEffect } from 'react';
import { useAccessibility } from '@/context/AccessibilityContext';
import { Button } from '@/components/ui/button';
import {
    Settings2,
    Sun,
    Moon,
    Monitor,
    X,
    ChevronDown
} from 'lucide-react';

export const AccessibilityBtn: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');
    const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
    const {
        isDarkMode,
        setIsDarkMode,
        colorBlindMode,
        setColorBlindMode,
    } = useAccessibility();

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
        setTheme(newTheme);
        if (newTheme === 'light') {
            setIsDarkMode(false);
        } else if (newTheme === 'dark') {
            setIsDarkMode(true);
        } else {
            // System theme - check preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    };

    const resetToDefault = () => {
        setFontSize('normal');
        handleThemeChange('light');
        setColorBlindMode('none');
    };

    // Apply font size to document
    useEffect(() => {
        const root = document.documentElement;
        if (fontSize === 'normal') {
            root.style.fontSize = '16px';
        } else if (fontSize === 'large') {
            root.style.fontSize = '20px';
        } else if (fontSize === 'larger') {
            root.style.fontSize = '24px';
        }
    }, [fontSize]);

    return (
        <div className="fixed bottom-6 left-6 z-50">
            {/* Floating Panel */}
            {isOpen && (
                <div
                    className="absolute bottom-16 left-0 w-64 bg-background border border-border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200"
                    style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                        <div className="flex items-center gap-2">
                            <Settings2 className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-sm">Accessibility</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-muted rounded-md transition-colors"
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-muted rounded-md transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 space-y-5">
                        {/* Theme Toggle */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <Sun className="w-4 h-4" />
                                Theme
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    onClick={() => handleThemeChange('light')}
                                    variant={theme === 'light' ? 'default' : 'outline'}
                                    size="sm"
                                    className="flex-1 h-7 text-[11px] px-1"
                                >
                                    Light
                                </Button>
                                <Button
                                    onClick={() => handleThemeChange('dark')}
                                    variant={theme === 'dark' ? 'default' : 'outline'}
                                    size="sm"
                                    className="flex-1 h-7 text-[11px] px-1"
                                >
                                    Dark
                                </Button>
                                <Button
                                    onClick={() => handleThemeChange('system')}
                                    variant={theme === 'system' ? 'default' : 'outline'}
                                    size="sm"
                                    className="flex-1 h-7 text-[11px] px-1"
                                >
                                    System
                                </Button>
                            </div>
                        </div>

                        {/* Font Size */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <span className="text-base font-bold">T</span>
                                    Font Size
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    {fontSize === 'normal' ? '100%' : fontSize === 'large' ? '125%' : '150%'}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <Button
                                    onClick={() => setFontSize('normal')}
                                    variant={fontSize === 'normal' ? 'default' : 'outline'}
                                    size="sm"
                                    className="flex-1 h-8 text-xs"
                                >
                                    A
                                </Button>
                                <Button
                                    onClick={() => setFontSize('large')}
                                    variant={fontSize === 'large' ? 'default' : 'outline'}
                                    size="sm"
                                    className="flex-1 h-8 text-sm"
                                >
                                    A+
                                </Button>
                                <Button
                                    onClick={() => setFontSize('larger')}
                                    variant={fontSize === 'larger' ? 'default' : 'outline'}
                                    size="sm"
                                    className="flex-1 h-8 text-base"
                                >
                                    A++
                                </Button>
                            </div>
                        </div>

                        {/* Colorblind Mode */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm font-medium">
                                <div className="w-4 h-4 rounded-full bg-gradient-to-r from-red-500 via-green-500 to-blue-500" />
                                Colorblind Mode
                            </div>
                            <div className="grid grid-cols-2 gap-1">
                                <Button
                                    onClick={() => setColorBlindMode('none')}
                                    variant={colorBlindMode === 'none' ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-auto py-2 flex flex-col items-start text-left"
                                >
                                    <span className="text-xs font-medium">Off</span>
                                    <span className={`text-[10px] opacity-70 ${colorBlindMode === 'none' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>Default colors</span>
                                </Button>
                                <Button
                                    onClick={() => setColorBlindMode('protanopia')}
                                    variant={colorBlindMode === 'protanopia' ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-auto py-2 flex flex-col items-start text-left"
                                >
                                    <span className="text-xs font-medium">Protanopia</span>
                                    <span className={`text-[10px] opacity-70 ${colorBlindMode === 'protanopia' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>Red-blind</span>
                                </Button>
                                <Button
                                    onClick={() => setColorBlindMode('deuteranopia')}
                                    variant={colorBlindMode === 'deuteranopia' ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-auto py-2 flex flex-col items-start text-left"
                                >
                                    <span className="text-xs font-medium">Deuteranopia</span>
                                    <span className={`text-[10px] opacity-70 ${colorBlindMode === 'deuteranopia' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>Green-blind</span>
                                </Button>
                                <Button
                                    onClick={() => setColorBlindMode('tritanopia')}
                                    variant={colorBlindMode === 'tritanopia' ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-auto py-2 flex flex-col items-start text-left"
                                >
                                    <span className="text-xs font-medium">Tritanopia</span>
                                    <span className={`text-[10px] opacity-70 ${colorBlindMode === 'tritanopia' ? 'text-primary-foreground' : 'text-muted-foreground'}`}>Blue-blind</span>
                                </Button>
                            </div>
                        </div>


                        {/* Reset */}
                        <div className="pt-3 border-t border-border">
                            <button
                                onClick={resetToDefault}
                                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                                    <path d="M3 3v5h5" />
                                </svg>
                                Reset to Default
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
                aria-label="Accessibility Options"
            >
                <Settings2 className="w-5 h-5" />
            </button>
        </div>
    );
};
