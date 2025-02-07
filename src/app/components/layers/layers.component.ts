// src/app/layers/layers.component.ts
import { Component, OnInit } from '@angular/core';
import { LayersService } from '../../services/layers.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './layers.component.html',
  styleUrls: ['./layers.component.css']
})
export class LayersComponent implements OnInit {
  layers: any[] = [];
  error: string = '';

  constructor(private layersService: LayersService) {}

  async ngOnInit() {
    try {
      this.layers = await this.layersService.getAccessibleLayers();
    } catch (error) {
      this.error = 'Failed to load layers';
    }
  }
}
