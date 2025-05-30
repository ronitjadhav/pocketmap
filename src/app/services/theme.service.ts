import { Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'pocketmap-theme';
  private readonly DARK_CLASS = 'dark-theme';
  private readonly LIGHT_CLASS = 'light-theme';
  
  public currentTheme = signal<Theme>('system');
  
  constructor() {
    this.initializeTheme();
  }
  
  private initializeTheme(): void {
    // Get saved theme from localStorage or use system preference as default
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme | null;
    const theme = savedTheme || 'system';
    this.currentTheme.set(theme);
    this.applyTheme(theme);
    
    // Listen for system theme changes if using system preference
    if (theme === 'system') {
      this.setupSystemThemeListener();
    }
  }
  
  private setupSystemThemeListener(): void {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Apply theme based on current system preference
    this.applySystemTheme(mediaQuery.matches);
    
    // Add listener for system theme changes
    mediaQuery.addEventListener('change', (e) => {
      if (this.currentTheme() === 'system') {
        this.applySystemTheme(e.matches);
      }
    });
  }
  
  private applySystemTheme(isDarkMode: boolean): void {
    if (isDarkMode) {
      document.documentElement.classList.add(this.DARK_CLASS);
      document.documentElement.classList.remove(this.LIGHT_CLASS);
    } else {
      document.documentElement.classList.add(this.LIGHT_CLASS);
      document.documentElement.classList.remove(this.DARK_CLASS);
    }
  }
  
  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
    localStorage.setItem(this.THEME_KEY, theme);
    this.applyTheme(theme);
  }
  
  public toggleTheme(): void {
    const currentTheme = this.currentTheme();
    
    if (currentTheme === 'light') {
      this.setTheme('dark');
    } else if (currentTheme === 'dark') {
      this.setTheme('light');
    } else {
      // If using system, toggle to explicit light/dark based on current system theme
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(isDarkMode ? 'light' : 'dark');
    }
  }
  
  private applyTheme(theme: Theme): void {
    if (theme === 'system') {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.applySystemTheme(isDarkMode);
    } else if (theme === 'dark') {
      document.documentElement.classList.add(this.DARK_CLASS);
      document.documentElement.classList.remove(this.LIGHT_CLASS);
    } else {
      document.documentElement.classList.add(this.LIGHT_CLASS);
      document.documentElement.classList.remove(this.DARK_CLASS);
    }
  }
  
  public isDarkMode(): boolean {
    const theme = this.currentTheme();
    
    if (theme === 'dark') {
      return true;
    } else if (theme === 'light') {
      return false;
    } else {
      // Check system preference for system theme
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  }
}