import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MapFacadeService} from '../../services/map-facade.service';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { bootstrapChevronCompactUp, bootstrapChevronDown } from '@ng-icons/bootstrap-icons';


@Component({
  selector: 'app-layer-panel',
  standalone: true,
  imports: [CommonModule, NgIcon],
  providers: [provideIcons({ bootstrapChevronCompactUp, bootstrapChevronDown })],
  templateUrl: './layer-panel.component.html',
})
export class LayerPanelComponent {
  @Input() layers: any[] = [];
  isCollapsed: boolean = false;

  constructor(private mapFacadeService: MapFacadeService) {}

  async onToggleLayer(layer: any) {
    // Toggle the visible flag.
    layer.visible = !layer.visible;
    // Filter for visible overlay layers.
    const visibleOverlays = this.layers
      .filter(l => l.visible)
      .map(l => ({ type: l.type, url: l.url, name: l.name }));
    // Use the facade to update overlays. The facade always keeps the basemap.
    await this.mapFacadeService.updateOverlays(visibleOverlays);
  }
}