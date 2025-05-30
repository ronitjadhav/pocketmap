import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPlus, heroEye, heroEyeSlash, heroAdjustmentsHorizontal } from '@ng-icons/heroicons/outline';

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  type: 'base' | 'overlay';
}

@Component({
  selector: 'app-layers-tool',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroPlus, heroEye, heroEyeSlash, heroAdjustmentsHorizontal })],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium theme-text">Layer Management</h4>
        <button class="p-2 hover:bg-white/10 rounded transition-colors">
          <ng-icon name="heroPlus" class="theme-text" size="16"></ng-icon>
        </button>
      </div>

      <div class="space-y-3">
        <div class="text-sm font-medium theme-text-secondary">Base Layers</div>
        <div *ngFor="let layer of baseLayers" class="layer-item">
          <div class="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <button (click)="toggleLayerVisibility(layer)"
                      class="p-1 hover:bg-white/10 rounded transition-colors">
                <ng-icon 
                  [name]="layer.visible ? 'heroEye' : 'heroEyeSlash'" 
                  class="theme-text" 
                  size="16">
                </ng-icon>
              </button>
              <span class="text-sm theme-text">{{ layer.name }}</span>
            </div>
            <button class="p-1 hover:bg-white/10 rounded transition-colors">
              <ng-icon name="heroAdjustmentsHorizontal" class="theme-text-secondary" size="16"></ng-icon>
            </button>
          </div>
          
          <!-- Opacity slider -->
          <div *ngIf="layer.visible" class="ml-8 mr-4 mt-2">
            <div class="flex items-center gap-2">
              <span class="text-xs theme-text-secondary">Opacity</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                [value]="layer.opacity"
                (input)="updateLayerOpacity(layer, $event)"
                class="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer opacity-slider">
              <span class="text-xs theme-text-secondary w-8">{{ layer.opacity }}%</span>
            </div>
          </div>
        </div>

        <div class="text-sm font-medium theme-text-secondary mt-6">Overlay Layers</div>
        <div *ngFor="let layer of overlayLayers" class="layer-item">
          <div class="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <button (click)="toggleLayerVisibility(layer)"
                      class="p-1 hover:bg-white/10 rounded transition-colors">
                <ng-icon 
                  [name]="layer.visible ? 'heroEye' : 'heroEyeSlash'" 
                  class="theme-text" 
                  size="16">
                </ng-icon>
              </button>
              <span class="text-sm theme-text">{{ layer.name }}</span>
            </div>
            <button class="p-1 hover:bg-white/10 rounded transition-colors">
              <ng-icon name="heroAdjustmentsHorizontal" class="theme-text-secondary" size="16"></ng-icon>
            </button>
          </div>
          
          <!-- Opacity slider -->
          <div *ngIf="layer.visible" class="ml-8 mr-4 mt-2">
            <div class="flex items-center gap-2">
              <span class="text-xs theme-text-secondary">Opacity</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                [value]="layer.opacity"
                (input)="updateLayerOpacity(layer, $event)"
                class="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer opacity-slider">
              <span class="text-xs theme-text-secondary w-8">{{ layer.opacity }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .opacity-slider::-webkit-slider-thumb {
      appearance: none;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background: currentColor;
      cursor: pointer;
      border: 2px solid white;
    }

    .opacity-slider::-moz-range-thumb {
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background: currentColor;
      cursor: pointer;
      border: 2px solid white;
      box-shadow: none;
    }
  `]
})
export class LayersToolComponent {
  baseLayers: Layer[] = [
    { id: 'osm', name: 'OpenStreetMap', visible: true, opacity: 100, type: 'base' },
    { id: 'satellite', name: 'Satellite', visible: false, opacity: 100, type: 'base' },
    { id: 'terrain', name: 'Terrain', visible: false, opacity: 100, type: 'base' }
  ];

  overlayLayers: Layer[] = [
    { id: 'traffic', name: 'Traffic', visible: false, opacity: 80, type: 'overlay' },
    { id: 'weather', name: 'Weather', visible: false, opacity: 70, type: 'overlay' },
    { id: 'boundaries', name: 'Boundaries', visible: false, opacity: 60, type: 'overlay' }
  ];

  toggleLayerVisibility(layer: Layer) {
    layer.visible = !layer.visible;
    // TODO: Integrate with map service
  }

  updateLayerOpacity(layer: Layer, event: Event) {
    const target = event.target as HTMLInputElement;
    layer.opacity = parseInt(target.value);
    // TODO: Integrate with map service
  }
}
