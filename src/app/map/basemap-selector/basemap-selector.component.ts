import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMap } from '@ng-icons/heroicons/outline';
import { MapFacadeService } from '../../services/map-facade.service';
import { BASEMAP_OPTIONS, BasemapOption } from '../../constants';

@Component({
  selector: 'app-basemap-selector',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroMap })],
  templateUrl: './basemap-selector.component.html'
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
