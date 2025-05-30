// src/app/map/map-view.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapContainerComponent } from '../map-container/map-container.component';
import { LayerPanelComponent } from '../layer-panel/layer-panel.component';
import { BasemapSelectorComponent } from '../basemap-selector/basemap-selector.component';
import { MapFacadeService } from '../../services/map-facade.service';
import { LayersService } from '../../services/layers.service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, MapContainerComponent, LayerPanelComponent, BasemapSelectorComponent],
  template: `
    <div class="relative w-full h-screen">
      <app-map-container></app-map-container>
      
      <!-- Layer Panel - Fixed position -->
      <div class="absolute bottom-4 left-4 z-50">
        <app-layer-panel [layers]="accessibleOverlays"></app-layer-panel>
      </div>
      
      <!-- Basemap Selector - Fixed position beside layer panel -->
      <div class="absolute bottom-4 z-50" 
           [ngClass]="{
             'left-[calc(16px+100vw-6rem-56px+8px)]': true,
             'sm:left-[calc(16px+300px+8px)]': true
           }">
        <app-basemap-selector></app-basemap-selector>
      </div>
    </div>
  `,
  styles: [`
    /* Fixed positioning ensures components don't affect each other */
    @media (max-width: 640px) {
      /* Mobile styles if needed */
    }
  `]
})
export class MapViewComponent implements OnInit {
  // These are the overlay layers fetched from PocketBase.
  accessibleOverlays: any[] = [];

  constructor(
    private layersService: LayersService, 
    private mapFacadeService: MapFacadeService
  ) {}

  async ngOnInit() {
    // Fetch overlay layers (without the basemap) from PocketBase.
    const layers = await this.layersService.getAccessibleLayers();
    this.accessibleOverlays = layers.map((l: any) => ({ ...l, visible: true }));
    // Update the overlays in the map facade. The facade will always keep the current basemap.
    await this.mapFacadeService.updateOverlays(
      this.accessibleOverlays.map(l => ({ type: l.type, url: l.url, name: l.name }))
    );
  }
}
