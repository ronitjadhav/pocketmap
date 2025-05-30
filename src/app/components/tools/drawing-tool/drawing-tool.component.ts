import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  heroPencil, 
  heroStop, 
  heroSquare2Stack, 
  heroTrash,
  heroMapPin,
  heroMinus,
  heroRectangleStack,
  heroEllipsisHorizontalCircle
} from '@ng-icons/heroicons/outline';

interface DrawingTool {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface DrawnFeature {
  id: string;
  type: string;
  name: string;
  created: Date;
}

@Component({
  selector: 'app-drawing-tool',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ 
    heroPencil, 
    heroStop, 
    heroSquare2Stack, 
    heroTrash,
    heroMapPin,
    heroMinus,
    heroRectangleStack,
    heroEllipsisHorizontalCircle
  })],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex items-center justify-between">
        <h4 class="font-medium theme-text">Drawing Tools</h4>
        <button 
          *ngIf="activeDrawingTool()"
          (click)="stopDrawing()"
          class="px-3 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors">
          Stop Drawing
        </button>
      </div>

      <!-- Drawing Tools -->
      <div class="space-y-2">
        <div class="text-sm font-medium theme-text-secondary">Tools</div>
        <div class="grid grid-cols-2 gap-2">
          <div *ngFor="let tool of drawingTools" class="w-full">
            <button 
              (click)="selectDrawingTool(tool)"
              [ngClass]="{
                'bg-blue-500/20 border-blue-500/50': activeDrawingTool()?.id === tool.id
              }"
              class="w-full p-3 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-left">
              <div class="flex items-center gap-2">
                <ng-icon [name]="tool.icon" class="theme-text" size="16"></ng-icon>
                <span class="text-sm theme-text">{{ tool.name }}</span>
              </div>
              <div class="text-xs theme-text-secondary mt-1">{{ tool.description }}</div>
            </button>
          </div>
        </div>
      </div>

      <!-- Drawing Options -->
      <div *ngIf="activeDrawingTool()" class="space-y-3 border-t border-white/10 pt-4">
        <div class="text-sm font-medium theme-text-secondary">Options</div>
        
        <!-- Stroke Color -->
        <div class="space-y-2">
          <label class="text-sm theme-text">Stroke Color</label>
          <div class="flex gap-2">
            <button 
              *ngFor="let color of strokeColors"
              (click)="selectedStrokeColor.set(color)"
              [ngClass]="{
                'ring-2 ring-white': selectedStrokeColor() === color
              }"
              class="w-8 h-8 rounded border border-white/20 hover:scale-110 transition-transform"
              [style.background-color]="color">
            </button>
          </div>
        </div>

        <!-- Stroke Width -->
        <div class="space-y-2">
          <label class="text-sm theme-text">Stroke Width</label>
          <div class="flex items-center gap-2">
            <input 
              type="range" 
              min="1" 
              max="10" 
              [value]="strokeWidth()"
              (input)="updateStrokeWidth($event)"
              class="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer">
            <span class="text-sm theme-text-secondary w-8">{{ strokeWidth() }}px</span>
          </div>
        </div>

        <!-- Fill Color (for polygons) -->
        <div *ngIf="activeDrawingTool()?.id === 'polygon'" class="space-y-2">
          <label class="text-sm theme-text">Fill Color</label>
          <div class="flex gap-2">
            <button 
              *ngFor="let color of fillColors"
              (click)="selectedFillColor.set(color)"
              [ngClass]="{
                'ring-2 ring-white': selectedFillColor() === color
              }"
              class="w-8 h-8 rounded border border-white/20 hover:scale-110 transition-transform"
              [style.background-color]="color">
            </button>
          </div>
        </div>
      </div>

      <!-- Existing Drawings -->
      <div class="space-y-3 border-t border-white/10 pt-4">
        <div class="flex items-center justify-between">
          <div class="text-sm font-medium theme-text-secondary">Drawings</div>
          <button 
            (click)="clearAllDrawings()"
            class="p-1 hover:bg-red-500/20 rounded transition-colors">
            <ng-icon name="heroTrash" class="text-red-400" size="16"></ng-icon>
          </button>
        </div>
        
        <div *ngIf="drawings.length === 0" class="text-sm theme-text-secondary text-center py-4">
          No drawings yet
        </div>
        
        <div *ngFor="let drawing of drawings; trackBy: trackDrawing" 
             class="flex items-center justify-between p-2 hover:bg-white/5 rounded">
          <div class="flex items-center gap-2">
            <div 
              class="w-3 h-3 rounded border"
              [style.background-color]="drawing.color">
            </div>
            <span class="text-sm theme-text">{{ drawing.name }}</span>
          </div>
          <button 
            (click)="deleteDrawing(drawing.id)"
            class="p-1 hover:bg-red-500/20 rounded transition-colors">
            <ng-icon name="heroTrash" class="text-red-400" size="12"></ng-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    input[type="range"]::-webkit-slider-thumb {
      appearance: none;
      height: 12px;
      width: 12px;
      border-radius: 50%;
      background: currentColor;
      cursor: pointer;
      border: 2px solid white;
    }

    input[type="range"]::-moz-range-thumb {
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
export class DrawingToolComponent {
  activeDrawingTool = signal<DrawingTool | null>(null);
  selectedStrokeColor = signal('#3b82f6');
  selectedFillColor = signal('#3b82f6');
  strokeWidth = signal(2);

  drawingTools: DrawingTool[] = [
    { id: 'point', name: 'Point', icon: 'heroMapPin', description: 'Add markers' },
    { id: 'line', name: 'Line', icon: 'heroMinus', description: 'Draw lines' },
    { id: 'polygon', name: 'Polygon', icon: 'heroStop', description: 'Draw shapes' },
    { id: 'freehand', name: 'Freehand', icon: 'heroPencil', description: 'Draw freely' }
  ];

  strokeColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];
  fillColors = ['#3b82f620', '#ef444420', '#10b98120', '#f59e0b20', '#8b5cf620', '#ec489920'];

  drawings: any[] = [
    { id: '1', name: 'Route 1', color: '#3b82f6', type: 'line' },
    { id: '2', name: 'Area of Interest', color: '#10b981', type: 'polygon' }
  ];

  selectDrawingTool(tool: DrawingTool) {
    this.activeDrawingTool.set(tool);
    // TODO: Integrate with map drawing functionality
  }

  stopDrawing() {
    this.activeDrawingTool.set(null);
    // TODO: Stop map drawing mode
  }

  updateStrokeWidth(event: Event) {
    const target = event.target as HTMLInputElement;
    this.strokeWidth.set(parseInt(target.value));
  }

  trackDrawing(index: number, drawing: any) {
    return drawing.id;
  }

  deleteDrawing(id: string) {
    this.drawings = this.drawings.filter(d => d.id !== id);
    // TODO: Remove from map
  }

  clearAllDrawings() {
    this.drawings = [];
    // TODO: Clear all drawings from map
  }
}
