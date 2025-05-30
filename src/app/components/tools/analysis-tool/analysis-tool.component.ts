import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroChartBarSquare, 
  heroMagnifyingGlass,
  heroMapPin,
  heroCalculator
} from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-analysis-tool',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ 
    heroChartBarSquare, 
    heroMagnifyingGlass,
    heroMapPin,
    heroCalculator
  })],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium theme-text">Analysis Tools</h4>
      </div>

      <!-- Measurement Tools -->
      <div class="space-y-3">
        <div class="text-sm font-medium theme-text-secondary">Measurements</div>
        <div class="space-y-2">
          <button class="w-full flex items-center gap-3 p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-left">
            <ng-icon name="heroMapPin" class="theme-text" size="20"></ng-icon>
            <div>
              <div class="text-sm theme-text">Distance Measurement</div>
              <div class="text-xs theme-text-secondary">Measure distances between points</div>
            </div>
          </button>
          
          <button class="w-full flex items-center gap-3 p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-left">
            <ng-icon name="heroCalculator" class="theme-text" size="20"></ng-icon>
            <div>
              <div class="text-sm theme-text">Area Calculation</div>
              <div class="text-xs theme-text-secondary">Calculate area of polygons</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Analysis Results -->
      <div class="space-y-3">
        <div class="text-sm font-medium theme-text-secondary">Recent Measurements</div>
        <div class="space-y-2">
          <div class="p-3 bg-white/5 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <div class="text-sm theme-text">Route Distance</div>
                <div class="text-lg font-mono theme-text">2.47 km</div>
              </div>
              <div class="text-xs theme-text-secondary">2 min ago</div>
            </div>
          </div>
          
          <div class="p-3 bg-white/5 rounded-lg">
            <div class="flex justify-between items-start">
              <div>
                <div class="text-sm theme-text">Area Size</div>
                <div class="text-lg font-mono theme-text">1.2 km²</div>
              </div>
              <div class="text-xs theme-text-secondary">5 min ago</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="space-y-3 border-t border-white/10 pt-4">
        <div class="text-sm font-medium theme-text-secondary">Quick Stats</div>
        <div class="grid grid-cols-2 gap-2">
          <div class="p-2 bg-white/5 rounded text-center">
            <div class="text-lg font-mono theme-text">{{ totalLayers() }}</div>
            <div class="text-xs theme-text-secondary">Layers</div>
          </div>
          <div class="p-2 bg-white/5 rounded text-center">
            <div class="text-lg font-mono theme-text">{{ totalDrawings() }}</div>
            <div class="text-xs theme-text-secondary">Drawings</div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AnalysisToolComponent {
  totalLayers = signal(5);
  totalDrawings = signal(3);
}
