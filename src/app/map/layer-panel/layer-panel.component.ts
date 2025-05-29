// layer-panel.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MapFacadeService} from '../../services/map-facade.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapChevronCompactUp, bootstrapChevronDown } from '@ng-icons/bootstrap-icons';
import { ToggleSwitchComponent } from '../../components/toggle-switch/toggle-switch.component';

@Component({
  selector: 'app-layer-panel',
  standalone: true,
  imports: [CommonModule, NgIcon, ToggleSwitchComponent],
  providers: [provideIcons({ bootstrapChevronCompactUp, bootstrapChevronDown })],
  template: `
    <div class="absolute bottom-4 left-4 z-50 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl min-w-[240px] max-w-[300px] sm:min-w-[280px]">
      <div class="p-4">
        <!-- Header Section -->
        <div class="flex items-center justify-between mb-4">
          <div class="relative inline-block">
            <h3 class="text-lg font-bold text-black">Layers</h3>
            <span class="text-xs text-black block mt-1">{{ layers.length }} available</span>
          </div>
          <button
            (click)="isCollapsed = !isCollapsed"
            class="flex items-center gap-1 px-3 py-1.5 bg-blue-500/80 backdrop-blur-sm text-black rounded-md shadow-sm hover:bg-blue-600/90 transition-all duration-150 border border-blue-400/30"
            [attr.aria-label]="isCollapsed ? 'Expand layers' : 'Collapse layers'"
            title="{{ isCollapsed ? 'Expand layers' : 'Collapse layers' }}">
            <ng-icon [name]="isCollapsed ? 'bootstrapChevronCompactUp' : 'bootstrapChevronDown'" size="16" class="text-black"></ng-icon>
          </button>
        </div>

        <!-- Layers List -->
        <div *ngIf="!isCollapsed"
          class="space-y-2"
          [ngStyle]="{
            'max-height': layers.length > 5 ? '300px' : 'auto',
            'overflow-y': layers.length > 5 ? 'auto' : 'visible'
          }">
          <div *ngFor="let layer of layers"
            class="flex items-center justify-between gap-2 p-2 bg-white/10 backdrop-blur-sm rounded-md hover:bg-white/20 transition-all duration-150 border border-white/10 text-black">
            <div class="flex items-center gap-1 overflow-hidden">
              <i class="fas fa-layer-group text-black text-xs flex-shrink-0"></i>
              <div class="flex flex-col overflow-hidden">
                <span class="text-sm font-medium text-black truncate group relative" title="{{ layer.name }}">
                  {{ layer.name }}
                  <span class="opacity-0 group-hover:opacity-100 absolute left-0 bottom-full bg-gray-800 text-white text-xs rounded py-1 px-2 mb-1 whitespace-nowrap transition-opacity duration-200 z-10">
                    {{ layer.name }}
                  </span>
                </span>
                <span class="text-[10px] text-black truncate" title="{{ layer.description }}">{{ layer.description }}</span>
              </div>
            </div>
            <app-toggle-switch 
              [isActive]="layer.visible" 
              (toggled)="onToggleLayer(layer, $event)"
              class="flex-shrink-0"
            ></app-toggle-switch>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="!isCollapsed && layers.length === 0" class="text-center py-4 text-white/70">
          <i class="fas fa-map-marked-alt text-2xl mb-2 block"></i>
          <p class="text-sm">No layers available</p>
        </div>
      </div>
    </div>
  `,
})
export class LayerPanelComponent {
  @Input() layers: any[] = [];
  isCollapsed: boolean = false;

  constructor(private mapFacadeService: MapFacadeService) {}

  async onToggleLayer(layer: any, isVisible?: boolean) {
    // If isVisible is provided, use it, otherwise toggle the current state
    layer.visible = isVisible !== undefined ? isVisible : !layer.visible;
    
    // Filter for visible overlay layers.
    const visibleOverlays = this.layers
      .filter(l => l.visible)
      .map(l => ({ type: l.type, url: l.url, name: l.name }));
    
    // Use the facade to update overlays. The facade always keeps the basemap.
    await this.mapFacadeService.updateOverlays(visibleOverlays);
  }
}