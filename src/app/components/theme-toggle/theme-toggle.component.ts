import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../services/theme.service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMoon, heroSun, heroCog6Tooth } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [provideIcons({ heroMoon, heroSun, heroCog6Tooth })],
  template: `
    <button 
      class="flex items-center justify-center p-2 rounded-lg hover:bg-white/20 transition-all duration-150 theme-button" 
      (click)="toggleTheme()"
      aria-label="Toggle theme">
      <ng-icon 
        [name]="isDarkMode ? 'heroMoon' : 'heroSun'" 
        class="theme-text"
        size="20">
      </ng-icon>
    </button>
  `,
  styleUrls: []
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  
  isOpen = false;
  
  get currentTheme(): Theme {
    return this.themeService.currentTheme();
  }
  
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
  
  toggleSwitcher(): void {
    this.isOpen = !this.isOpen;
  }
  
  selectTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.isOpen = false;
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  closeDropdown(): void {
    this.isOpen = false;
  }
}