import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMap } from '@ng-icons/heroicons/outline';
import { heroChevronDown, heroChevronUp } from '@ng-icons/heroicons/outline';
import { MapFacadeService } from '../../services/map-facade.service';
import { BASEMAP_OPTIONS, BasemapOption } from '../../constants';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-basemap-selector',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroMap, heroChevronDown, heroChevronUp })],
  templateUrl: './basemap-selector.component.html'
})
export class BasemapSelectorComponent {
  isOpen = signal(false);
  basemapOptions = BASEMAP_OPTIONS;
  selectedBasemap = signal(BASEMAP_OPTIONS[0]);
  themeService = inject(ThemeService);

  constructor(private mapFacadeService: MapFacadeService) {
    // Initialize the selected basemap from the current context
    const currentBasemap = this.mapFacadeService.currentContext.layers[0];
    const matchingOption = this.basemapOptions.find(option => 
      option.url === currentBasemap.url && option.type === currentBasemap.type
    );
    
    if (matchingOption) {
      this.selectedBasemap.set(matchingOption);
    }
  }
  
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  toggleSelector() {
    this.isOpen.update(value => !value);
  }

  async selectBasemap(basemap: BasemapOption) {
    this.selectedBasemap.set(basemap);
    await this.mapFacadeService.updateBasemap(basemap);
    this.isOpen.set(false);
  }
}
