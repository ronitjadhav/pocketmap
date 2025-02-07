import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMap } from '@ng-icons/heroicons/outline';
import { MapFacadeService } from '../../services/map-facade.service';
import { BASEMAP_OPTIONS, BasemapOption } from '../../constants';

@Component({
  selector: 'app-basemap-selector',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({ heroMap })
  ],
  template: `
    <div class="fixed bottom-4 right-4 z-10">
      <!-- Compact button -->
      <button 
        (click)="toggleSelector()"
        class="flex items-center bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        <ng-icon name="heroMap" class="text-gray-600" size="20"></ng-icon>
      </button>

      <!-- Compact menu -->
      <div 
        *ngIf="isOpen()"
        class="absolute bottom-full mb-2 right-0 p-2 bg-white rounded-lg shadow-xl z-50 min-w-[160px]"
      >
        <div class="grid gap-1">
          <button 
            *ngFor="let option of basemapOptions"
            (click)="selectBasemap(option)"
            class="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            [class.bg-blue-50]="option.name === selectedBasemap().name"
          >
            {{ option.name }}
          </button>
        </div>
      </div>

      <!-- Backdrop -->
      <div 
        *ngIf="isOpen()"
        class="fixed inset-0 z-40"
        (click)="toggleSelector()"
      ></div>
    </div>
  `
})
export class BasemapSelectorComponent {
  isOpen = signal(false);
  basemapOptions = BASEMAP_OPTIONS;
  selectedBasemap = signal(BASEMAP_OPTIONS[0]);

  constructor(private mapFacadeService: MapFacadeService) {}

  toggleSelector() {
    this.isOpen.update(value => !value);
  }

  async selectBasemap(basemap: BasemapOption) {
    this.selectedBasemap.set(basemap);
    await this.mapFacadeService.updateBasemap(basemap);
    this.isOpen.set(false);
  }
}