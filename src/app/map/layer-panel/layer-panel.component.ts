// layer-panel.component.ts
import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MapFacadeService} from '../../services/map-facade.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapChevronCompactUp, bootstrapChevronDown } from '@ng-icons/bootstrap-icons';
import { ToggleSwitchComponent } from '../../components/toggle-switch/toggle-switch.component';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-layer-panel',
  standalone: true,
  imports: [CommonModule, NgIcon, ToggleSwitchComponent],
  providers: [provideIcons({ bootstrapChevronCompactUp, bootstrapChevronDown })],
  templateUrl: './layer-panel.component.html',
  styles: [`
    .mobile-layer-panel {
      min-height: 40px;
    }
  `],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        height: '*',
        opacity: 1
      })),
      state('out', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('in => out', animate('200ms ease-in-out')),
      transition('out => in', animate('200ms ease-in-out'))
    ])
  ]
})
export class LayerPanelComponent {
  @Input() layers: any[] = [];
  isCollapsed: boolean = false;
  
  themeService = inject(ThemeService);

  constructor(private mapFacadeService: MapFacadeService) {}
  
  get isDarkMode(): boolean {
    return this.themeService.isDarkMode();
  }

  async onToggleLayer(layer: any, isVisible?: boolean) {
    // If isVisible is provided (from toggle event), use it, otherwise toggle the current state
    layer.visible = isVisible !== undefined ? isVisible : !layer.visible;
    
    // Filter for visible overlay layers.
    const visibleOverlays = this.layers
      .filter(l => l.visible)
      .map(l => ({ type: l.type, url: l.url, name: l.name }));
    
    // Use the facade to update overlays. The facade always keeps the basemap.
    await this.mapFacadeService.updateOverlays(visibleOverlays);
  }
}