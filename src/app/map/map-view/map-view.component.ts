import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapContainerComponent } from '../map-container/map-container.component';
import { LayerPanelComponent } from '../layer-panel/layer-panel.component';
import { MapFacadeService } from '../../services/map-facade.service';
import { LayersService } from '../../services/layers.service';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [CommonModule, MapContainerComponent, LayerPanelComponent],
  template: `
    <div class="relative w-full h-screen">
      <app-map-container></app-map-container>
      <app-layer-panel [layers]="accessibleOverlays"></app-layer-panel>
    </div>
  `
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
    // Add a local 'visible' flag to each overlay (default true).
    this.accessibleOverlays = layers.map((l: any) => ({ ...l, visible: true }));
    // Update the map overlays using the facade.
    await this.mapFacadeService.updateOverlays(
      this.accessibleOverlays.map(l => ({ type: l.type, url: l.url, name: l.name }))
    );
  }
}
