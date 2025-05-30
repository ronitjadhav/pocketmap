import { Component, inject, signal, ViewChild, ViewContainerRef, ComponentRef, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroXMark, heroArrowLeft } from '@ng-icons/heroicons/outline';
import { FloatingSidebarService, FloatingSidebarState } from '../../services/floating-sidebar.service';

@Component({
  selector: 'app-floating-sidebar',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroXMark, heroArrowLeft })],
  template: `
    <!-- Desktop Floating Sidebar -->
    <div *ngIf="sidebarService.sidebarState().isOpen && !sidebarService.sidebarState().isMobile"
         class="fixed right-4 top-20 z-40 w-80 max-h-[calc(100vh-6rem)] theme-panel backdrop-blur-lg rounded-lg shadow-xl border border-white/10 overflow-hidden transition-all duration-300 ease-out"
         [class.animate-slide-in-right]="sidebarService.sidebarState().isOpen">
      
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-white/10">
        <div class="flex items-center gap-3">
          <ng-icon 
            [name]="sidebarService.sidebarState().activeTool?.icon || ''" 
            class="theme-text"
            size="20">
          </ng-icon>
          <h3 class="font-semibold theme-text">
            {{ sidebarService.sidebarState().activeTool?.title }}
          </h3>
        </div>
        <button 
          (click)="closeSidebar()"
          class="p-1 hover:bg-white/10 rounded transition-colors">
          <ng-icon name="heroXMark" class="theme-text" size="20"></ng-icon>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-auto max-h-[calc(100vh-12rem)]">
        <ng-container #toolContent></ng-container>
      </div>
    </div>

    <!-- Mobile Full Screen Overlay -->
    <div *ngIf="sidebarService.sidebarState().isOpen && sidebarService.sidebarState().isMobile"
         class="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-all duration-300 ease-out"
         [class.animate-fade-in]="sidebarService.sidebarState().isOpen">
      
      <!-- Mobile Panel -->
      <div class="fixed inset-x-0 bottom-0 top-16 theme-panel rounded-t-2xl shadow-2xl transition-all duration-300 ease-out"
           [class.animate-slide-in-bottom]="sidebarService.sidebarState().isOpen">
        
        <!-- Drag Handle -->
        <div class="flex justify-center py-3 border-b border-white/10">
          <div class="w-12 h-1 bg-white/30 rounded-full"></div>
        </div>
        
        <!-- Header -->
        <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <button 
            (click)="closeSidebar()"
            class="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <ng-icon name="heroArrowLeft" class="theme-text" size="20"></ng-icon>
          </button>
          <div class="flex items-center gap-3">
            <ng-icon 
              [name]="sidebarService.sidebarState().activeTool?.icon || ''" 
              class="theme-text"
              size="20">
            </ng-icon>
            <h3 class="font-semibold theme-text">
              {{ sidebarService.sidebarState().activeTool?.title }}
            </h3>
          </div>
          <div class="w-10"></div> <!-- Spacer for centering -->
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-auto">
          <ng-container #toolContentMobile></ng-container>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slide-in-bottom {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }

    @keyframes fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .animate-slide-in-right {
      animation: slide-in-right 0.3s ease-out forwards;
    }

    .animate-slide-in-bottom {
      animation: slide-in-bottom 0.3s ease-out forwards;
    }

    .animate-fade-in {
      animation: fade-in 0.3s ease-out forwards;
    }

    /* Touch-friendly mobile interactions */
    @media (max-width: 640px) {
      .theme-panel {
        border-radius: 1rem 1rem 0 0;
      }
    }
  `]
})
export class FloatingSidebarComponent implements OnDestroy {
  @ViewChild('toolContent', { read: ViewContainerRef }) toolContent!: ViewContainerRef;
  @ViewChild('toolContentMobile', { read: ViewContainerRef }) toolContentMobile!: ViewContainerRef;
  
  sidebarService = inject(FloatingSidebarService);
  private currentComponentRef: ComponentRef<any> | null = null;

  constructor() {
    // Watch for tool changes and load the appropriate component
    effect(() => {
      const state = this.sidebarService.sidebarState();
      if (state.isOpen && state.activeTool) {
        this.loadToolComponent(state.activeTool.component, state.isMobile);
      } else {
        this.clearToolComponent();
      }
    });
  }

  ngOnDestroy() {
    this.clearToolComponent();
  }

  closeSidebar() {
    this.sidebarService.closeSidebar();
  }

  private loadToolComponent(componentType: any, isMobile: boolean) {
    this.clearToolComponent();
    
    const container = isMobile ? this.toolContentMobile : this.toolContent;
    if (container) {
      this.currentComponentRef = container.createComponent(componentType);
    }
  }

  private clearToolComponent() {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = null;
    }
    
    this.toolContent?.clear();
    this.toolContentMobile?.clear();
  }
}
