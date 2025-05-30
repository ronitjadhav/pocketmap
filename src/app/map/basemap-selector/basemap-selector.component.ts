import { Component, signal, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroMap, heroChevronDown, heroChevronUp, heroXMark } from '@ng-icons/heroicons/outline';
import { MapFacadeService } from '../../services/map-facade.service';
import { BASEMAP_OPTIONS, BasemapOption } from '../../constants';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-basemap-selector',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ heroMap, heroChevronDown, heroChevronUp, heroXMark })],
  templateUrl: './basemap-selector.component.html',
  styles: [`
    .mobile-basemap-btn {
      height: 40px;
      width: 40px;
    }
  `]
})
export class BasemapSelectorComponent implements OnInit {
  isOpen = signal(false);
  basemapOptions = BASEMAP_OPTIONS;
  selectedBasemap = signal(BASEMAP_OPTIONS[0]);
  themeService = inject(ThemeService);
  isMobile = signal(window.innerWidth < 640);

  constructor(private mapFacadeService: MapFacadeService) {
    // Initialize the selected basemap from the current context
  }
  
  ngOnInit() {
    // Initialize the selected basemap from the current context
    const currentBasemap = this.mapFacadeService.currentContext.layers[0];
    const matchingOption = this.basemapOptions.find(option => 
      option.url === currentBasemap.url && option.type === currentBasemap.type
    );
    
    if (matchingOption) {
      this.selectedBasemap.set(matchingOption);
    }
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.isMobile.set(window.innerWidth < 640);
    
    // Close the selector if it was open when switching between mobile/desktop views
    if (this.isOpen()) {
      this.toggleSelector(true);
    }
  }
  
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }
  
  // Return the value of the isMobile signal
  isOnMobileDevice(): boolean {
    return this.isMobile();
  }

  toggleSelector(forceClose = false) {
    if (forceClose) {
      this.isOpen.set(false);
      document.body.classList.remove('overflow-hidden');
      return;
    }
    
    this.isOpen.update(value => !value);
    
    // Add body class to prevent scrolling when mobile menu is open
    if (this.isOpen()) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }

  async selectBasemap(basemap: BasemapOption) {
    try {
      // Update UI immediately to provide feedback
      this.selectedBasemap.set(basemap);
      
      // First update the basemap in the map service
      await this.mapFacadeService.updateBasemap(basemap);
      
      // Close only after successful update
      this.isOpen.set(false);
      document.body.classList.remove('overflow-hidden');
    } catch (error) {
      console.error('Failed to update basemap:', error);
      // Provide visual feedback that something went wrong
      // but still close the modal to not block the UI
      this.isOpen.set(false);
      document.body.classList.remove('overflow-hidden');
    }
  }
}
