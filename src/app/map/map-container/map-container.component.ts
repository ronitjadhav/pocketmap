// src/app/map/map-container.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createMapFromContext } from '@geospatial-sdk/openlayers';
import { MapFacadeService } from '../../services/map-facade.service'; 

@Component({
  selector: 'app-map-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #mapRoot class="w-full h-full"></div>
  `
})
export class MapContainerComponent implements OnInit {
  @ViewChild('mapRoot', { static: true }) mapRoot!: ElementRef<HTMLDivElement>;

  constructor(private mapFacadeService: MapFacadeService) {}

  async ngOnInit() {
    const context = this.mapFacadeService.currentContext;
    const map = await createMapFromContext(context, this.mapRoot.nativeElement);
    this.mapFacadeService.setMap(map);
  }
}
