import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroCheckMini, heroXMarkMini } from '@ng-icons/heroicons/mini';

@Component({
  selector: 'app-toggle-switch',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroCheckMini, heroXMarkMini })],
  template: `
    <div class="inline-block cursor-pointer" (click)="toggle()" title="{{ isActive ? 'Enabled' : 'Disabled' }}">
      <div class="relative w-12 h-6 rounded-full border shadow-sm transition-all duration-200"
           [ngClass]="isActive ? 
            (isDarkMode ? 'bg-blue-500/60 border-blue-400/30' : 'bg-blue-500/70 border-blue-400/20') : 
            (isDarkMode ? 'bg-gray-700/50 border-gray-600/30' : 'bg-gray-300/50 border-gray-400/20')">
        <span class="absolute top-0.5 left-0.5 rounded-full h-5 w-5 shadow-md transition-transform duration-300 ease-in-out flex items-center justify-center"
              [ngClass]="isActive ? 
                (isDarkMode ? 'bg-blue-200' : 'bg-white') : 
                (isDarkMode ? 'bg-gray-400' : 'bg-gray-200')"
              [style.transform]="isActive ? 'translateX(24px)' : 'translateX(0)'">
          <ng-icon 
            *ngIf="showIcons" 
            [name]="isActive ? 'heroCheckMini' : 'heroXMarkMini'" 
            [ngClass]="isActive ? 'text-blue-600' : 'text-gray-600'"
            size="12">
          </ng-icon>
        </span>
      </div>
    </div>
  `,
  styleUrls: []
})
export class ToggleSwitchComponent {
  @Input() isActive: boolean = false;
  @Input() showIcons: boolean = true;
  @Output() toggled = new EventEmitter<boolean>();

  private themeService = inject(ThemeService);

  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggle() {
    this.isActive = !this.isActive;
    this.toggled.emit(this.isActive);
  }
}
