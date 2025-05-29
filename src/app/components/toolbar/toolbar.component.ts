import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroChevronRight, 
  heroChevronLeft,
  heroWrenchScrewdriver 
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ 
    heroChevronRight, 
    heroChevronLeft,
    heroWrenchScrewdriver
  })],
  template: `
    <div class="flex items-center relative h-[52px]" [class.collapsed]="isCollapsed()">
      <div class="flex items-center h-full theme-panel backdrop-blur-lg rounded-lg overflow-hidden transition-all duration-300"
           [ngStyle]="{ width: isCollapsed() ? '40px' : '400px' }">
        
        <!-- Toggle button with tools icon -->
        <button (click)="toggleCollapse()" 
                class="flex-shrink-0 h-full px-2 hover:bg-white/10 transition-colors duration-150 border-r border-white/10 flex items-center gap-2">
          <ng-icon 
            *ngIf="!isCollapsed()"
            name="heroChevronLeft" 
            class="theme-text"
            size="20">
          </ng-icon>
          <ng-icon 
            name="heroWrenchScrewdriver" 
            class="theme-text"
            [class.mr-1]="!isCollapsed()"
            size="20">
          </ng-icon>
          <ng-icon 
            *ngIf="isCollapsed()"
            name="heroChevronRight" 
            class="theme-text"
            size="20">
          </ng-icon>
        </button>

        <!-- Tools container -->
        <div class="flex items-center gap-4 px-3 overflow-x-auto"
             [class.opacity-0]="isCollapsed()"
             [class.invisible]="isCollapsed()">
          <span class="text-sm font-medium theme-text whitespace-nowrap">Map Tools</span>
          <div class="h-4 border-r border-white/10"></div>
          <span class="text-sm theme-text-secondary whitespace-nowrap">Tools will go here</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .collapsed .theme-panel {
      width: 40px !important;
    }
  `]
})
export class ToolbarComponent {
  isCollapsed = signal(false);

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }
}
