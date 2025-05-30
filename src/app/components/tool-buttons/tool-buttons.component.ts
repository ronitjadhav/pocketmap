import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroSquare3Stack3d, heroChartBarSquare } from '@ng-icons/heroicons/outline';
import { FloatingSidebarService, ToolConfig } from '../../services/floating-sidebar.service';
import { LayersToolComponent } from '../tools/layers-tool/layers-tool.component';
import { AnalysisToolComponent } from '../tools/analysis-tool/analysis-tool.component';

@Component({
  selector: 'app-tool-buttons',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroSquare3Stack3d, heroChartBarSquare })],
  template: `
    <div class="flex items-center gap-2">
      <button 
        (click)="openLayersTool()"
        [class.bg-blue-500/20]="sidebarService.isToolActive('layers')"
        [class.border-blue-500/50]="sidebarService.isToolActive('layers')"
        class="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
        title="Manage map layers">
        <ng-icon name="heroSquare3Stack3d" class="theme-text" size="16"></ng-icon>
        <span class="text-sm theme-text whitespace-nowrap">Layers</span>
      </button>

      <button 
        (click)="openAnalysisTool()"
        [class.bg-blue-500/20]="sidebarService.isToolActive('analysis')"
        [class.border-blue-500/50]="sidebarService.isToolActive('analysis')"
        class="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
        title="Analysis and measurement tools">
        <ng-icon name="heroChartBarSquare" class="theme-text" size="16"></ng-icon>
        <span class="text-sm theme-text whitespace-nowrap">Analysis</span>
      </button>
    </div>
  `
})
export class ToolButtonsComponent {
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

  openLayersTool() {
    this.sidebarService.toggleTool(this.layersTool);
  }

  openAnalysisTool() {
    this.sidebarService.toggleTool(this.analysisTool);
  }
}
