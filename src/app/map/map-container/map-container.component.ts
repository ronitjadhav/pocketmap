// src/app/map/map-container.component.ts
import { Component, OnInit, ViewChild, ElementRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createMapFromContext } from '@geospatial-sdk/openlayers';
import { MapFacadeService } from '../../services/map-facade.service';
import { ThemeService } from '../../services/theme.service'; 

@Component({
  selector: 'app-map-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #mapRoot class="w-full h-full theme-map-container"></div>
  `,
  styles: [`
    .theme-map-container {
      position: relative;
      width: 100%;
      height: 100%;
    }
  `]
})
export class MapContainerComponent implements OnInit {
  @ViewChild('mapRoot', { static: true }) mapRoot!: ElementRef<HTMLDivElement>;

  constructor(private mapFacadeService: MapFacadeService) {}

  private themeService = inject(ThemeService);

  async ngOnInit() {
    // Initialize map using facade's initialization method
    await this.mapFacadeService.initMap(this.mapRoot.nativeElement);
    
    // Apply theme to map controls
    this.updateControlsTheme();
    
    // Set up effect to watch for theme changes (using signals)
    effect(() => {
      // Just reference the signal to make the effect re-run when it changes
      const _ = this.themeService.currentTheme();
      this.updateControlsTheme();
    });
  }
  
  private updateControlsTheme(): void {
    // The CSS will handle most styling, but we can add additional logic here if needed
    // For example, we could add different icons for zoom buttons based on theme
    document.documentElement.classList.contains('dark-theme') 
      ? this.mapRoot.nativeElement.classList.add('dark-map-controls')
      : this.mapRoot.nativeElement.classList.remove('dark-map-controls');
  }
}
