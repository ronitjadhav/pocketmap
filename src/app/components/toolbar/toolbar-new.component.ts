import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroChevronRight, 
  heroChevronLeft,
  heroWrenchScrewdriver,
  heroSquare3Stack3d,
  heroPencilSquare,
  heroChartBarSquare,
  heroCog6Tooth
} from '@ng-icons/heroicons/outline';
import { FloatingSidebarService, ToolConfig } from '../../services/floating-sidebar.service';
import { LayersToolComponent } from '../tools/layers-tool/layers-tool.component';
import { AnalysisToolComponent } from '../tools/analysis-tool/analysis-tool.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ 
    heroChevronRight, 
    heroChevronLeft,
    heroWrenchScrewdriver,
    heroSquare3Stack3d,
    heroPencilSquare,
    heroChartBarSquare,
    heroCog6Tooth
  })],
  template: `
    <div class="flex items-center relative h-[52px]" [class.collapsed]="isCollapsed()">
      <div class="flex items-center h-full theme-panel backdrop-blur-lg rounded-lg overflow-hidden transition-all duration-300 shadow-lg"
           [ngClass]="{ 
             'w-[40px]': isCollapsed(), 
             'w-[400px] sm:w-[500px] md:w-[600px]': !isCollapsed() 
           }">
        
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
        <div class="flex items-center gap-2 px-3 overflow-x-auto flex-nowrap"
             [class.opacity-0]="isCollapsed()"
             [class.invisible]="isCollapsed()">
          <span class="text-sm font-medium theme-text whitespace-nowrap mr-2">Tools</span>
          
          <!-- Layers Tool -->
          <button 
            (click)="openLayersTool()"
            [class.bg-blue-500/20]="sidebarService.isToolActive('layers')"
            [class.border-blue-500/50]="sidebarService.isToolActive('layers')"
            class="flex-shrink-0 flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            title="Manage map layers">
            <ng-icon name="heroSquare3Stack3d" class="theme-text" size="16"></ng-icon>
            <span class="text-sm theme-text whitespace-nowrap">Layers</span>
          </button>

          <!-- Analysis Tool -->
          <button 
            (click)="openAnalysisTool()"
            [class.bg-blue-500/20]="sidebarService.isToolActive('analysis')"
            [class.border-blue-500/50]="sidebarService.isToolActive('analysis')"
            class="flex-shrink-0 flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
            title="Analysis and measurement tools">
            <ng-icon name="heroChartBarSquare" class="theme-text" size="16"></ng-icon>
            <span class="text-sm theme-text whitespace-nowrap">Analysis</span>
          </button>

          <!-- Drawing Tool Placeholder -->
          <button 
            class="flex-shrink-0 flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors opacity-50"
            title="Drawing tools (Coming Soon)">
            <ng-icon name="heroPencilSquare" class="theme-text" size="16"></ng-icon>
            <span class="text-sm theme-text whitespace-nowrap">Draw</span>
          </button>

          <!-- Settings Tool Placeholder -->
          <button 
            class="flex-shrink-0 flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors opacity-50"
            title="Application settings (Coming Soon)">
            <ng-icon name="heroCog6Tooth" class="theme-text" size="16"></ng-icon>
            <span class="text-sm theme-text whitespace-nowrap">Settings</span>
          </button>
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
  sidebarService = inject(FloatingSidebarService);

  layersTool: ToolConfig = {
    id: 'layers',
    title: 'Layers',
    icon: 'heroSquare3Stack3d',
    component: LayersToolComponent,
    description: 'Manage map layers'
  };

  analysisTool: ToolConfig = {
    id: 'analysis',
    title: 'Analysis',
    icon: 'heroChartBarSquare',
    component: AnalysisToolComponent,
    description: 'Analysis and measurement tools'
  };

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }

  openLayersTool() {
    this.sidebarService.toggleTool(this.layersTool);
  }

  openAnalysisTool() {
    this.sidebarService.toggleTool(this.analysisTool);
  }
}
