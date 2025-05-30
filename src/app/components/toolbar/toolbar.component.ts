import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroChevronRight, 
  heroChevronLeft,
  heroWrenchScrewdriver,
  heroSquare3Stack3d,
  heroChartBarSquare,
  heroPencil,
  heroCog6Tooth,
  heroXMark
} from '@ng-icons/heroicons/outline';
import { FloatingSidebarService, ToolConfig } from '../../services/floating-sidebar.service';
import { LayersToolComponent } from '../tools/layers-tool/layers-tool.component';
import { AnalysisToolComponent } from '../tools/analysis-tool/analysis-tool.component';
import { DrawingToolComponent } from '../tools/drawing-tool/drawing-tool.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ 
    heroChevronRight, 
    heroChevronLeft,
    heroWrenchScrewdriver,
    heroSquare3Stack3d,
    heroChartBarSquare,
    heroPencil,
    heroCog6Tooth,
    heroXMark
  })],
  template: `
    <!-- Mobile Toolbar (now at the top, beside auth) -->
    <div class="sm:hidden">
      <div class="fixed top-4 left-4 right-auto z-50 flex flex-row gap-2 items-start">
        <div class="theme-panel backdrop-blur-lg rounded-xl shadow-lg border border-white/10 overflow-hidden">
          <!-- Collapsed State - Top Bar -->
          <div *ngIf="isCollapsed()" class="flex items-center justify-center p-3">
            <button (click)="toggleCollapse()" 
                    class="flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg">
              <ng-icon name="heroWrenchScrewdriver" class="theme-text" size="20"></ng-icon>
              <span class="text-sm font-medium theme-text">Tools</span>
            </button>
          </div>
          <!-- Expanded State - Tool Grid -->
          <div *ngIf="!isCollapsed()" class="p-4">
            <div class="flex items-center justify-between mb-4">
              <span class="text-sm font-medium theme-text">Map Tools</span>
              <button (click)="toggleCollapse()" 
                      class="p-1 hover:bg-white/10 rounded transition-colors">
                <ng-icon name="heroXMark" class="theme-text" size="16"></ng-icon>
              </button>
            </div>
            <div class="grid grid-cols-3 gap-3">
              <button 
                (click)="openLayersTool(); toggleCollapse()"
                [ngClass]="{ 'bg-blue-500/20 border-blue-500/50': sidebarService.isToolActive('layers') }"
                class="flex flex-col items-center gap-2 p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <ng-icon name="heroSquare3Stack3d" class="theme-text" size="24"></ng-icon>
                <span class="text-xs theme-text">Layers</span>
              </button>
              <button 
                (click)="openDrawingTool(); toggleCollapse()"
                [ngClass]="{ 'bg-blue-500/20 border-blue-500/50': sidebarService.isToolActive('drawing') }"
                class="flex flex-col items-center gap-2 p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <ng-icon name="heroPencil" class="theme-text" size="24"></ng-icon>
                <span class="text-xs theme-text">Drawing</span>
              </button>
              <button 
                (click)="openAnalysisTool(); toggleCollapse()"
                [ngClass]="{ 'bg-blue-500/20 border-blue-500/50': sidebarService.isToolActive('analysis') }"
                class="flex flex-col items-center gap-2 p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors">
                <ng-icon name="heroChartBarSquare" class="theme-text" size="24"></ng-icon>
                <span class="text-xs theme-text">Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop Toolbar -->
    <div class="hidden sm:flex items-center relative h-[52px]" [class.collapsed]="isCollapsed()">
      <div class="flex items-center h-full theme-panel backdrop-blur-lg rounded-lg overflow-hidden transition-all duration-300 shadow-lg"
           [ngClass]="{ 
             'w-[40px]': isCollapsed(), 
             'w-[280px] sm:w-[350px] md:w-[400px]': !isCollapsed() 
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
        <div class="flex items-center gap-4 px-3 overflow-x-auto flex-wrap sm:flex-nowrap"
             [class.opacity-0]="isCollapsed()"
             [class.invisible]="isCollapsed()">
          <span class="text-sm font-medium theme-text whitespace-nowrap">Map Tools</span>
          <div class="h-4 border-r border-white/10 hidden sm:block"></div>
          
          <!-- Desktop Tool Buttons -->
          <div class="flex gap-2">
            <button 
              (click)="openLayersTool()"
              [ngClass]="{ 'bg-blue-500/20 border-blue-500/50': sidebarService.isToolActive('layers') }"
              class="px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
              <ng-icon name="heroSquare3Stack3d" class="theme-text" size="16"></ng-icon>
              <span class="text-sm theme-text">Layers</span>
            </button>
            
            <button 
              (click)="openDrawingTool()"
              [ngClass]="{ 'bg-blue-500/20 border-blue-500/50': sidebarService.isToolActive('drawing') }"
              class="px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
              <ng-icon name="heroPencil" class="theme-text" size="16"></ng-icon>
              <span class="text-sm theme-text">Drawing</span>
            </button>
            
            <button 
              (click)="openAnalysisTool()"
              [ngClass]="{ 'bg-blue-500/20 border-blue-500/50': sidebarService.isToolActive('analysis') }"
              class="px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors flex items-center gap-2">
              <ng-icon name="heroChartBarSquare" class="theme-text" size="16"></ng-icon>
              <span class="text-sm theme-text">Analysis</span>
            </button>
          </div>
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

  drawingTool: ToolConfig = {
    id: 'drawing',
    title: 'Drawing',
    icon: 'heroPencil',
    component: DrawingToolComponent,
    description: 'Drawing and annotation tools'
  };

  toggleCollapse() {
    this.isCollapsed.update(v => !v);
  }

  openLayersTool() {
    this.sidebarService.toggleTool(this.layersTool);
  }

  openDrawingTool() {
    this.sidebarService.toggleTool(this.drawingTool);
  }

  openAnalysisTool() {
    this.sidebarService.toggleTool(this.analysisTool);
  }
}
