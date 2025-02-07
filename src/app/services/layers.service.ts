// src/app/services/layers.service.ts
import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LayersService {
  pb: PocketBase;

  constructor(private authService: AuthService) {
    // Use the same PocketBase instance from AuthService.
    this.pb = this.authService.pb;
  }

  async getAccessibleLayers() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('User is not authenticated');
      }
      // Use expand to get the full related layer records.
      const perms = await this.pb
        .collection('layer_permissions')
        .getFullList(200, {
          filter: 'action = "read"',
          expand: 'layer,user'
        });

      console.log('Permission records:', perms);

      // Extract expanded layer records from each permission.
      const layersFromPermissions = perms.flatMap((p: any) => {
        // Check the expand property for the related "layer" data.
        if (p.expand && p.expand.layer) {
          if (Array.isArray(p.expand.layer)) {
            return p.expand.layer;
          } else {
            return [p.expand.layer];
          }
        }
        // Fallback if not expanded (if your configuration ever returns raw IDs)
        if (p.layer) {
          if (Array.isArray(p.layer)) {
            return p.layer.map((l: any) => ({ id: l }));
          } else {
            return [{ id: p.layer }];
          }
        }
        return [];
      });

      // Deduplicate layers by their id.
      const layerMap = new Map<string, any>();
      layersFromPermissions.forEach((l: any) => {
        if (l.id && !layerMap.has(l.id)) {
          layerMap.set(l.id, l);
        }
      });
      const uniqueLayers = Array.from(layerMap.values());

      console.log('Unique accessible layers:', uniqueLayers);
      return uniqueLayers;
    } catch (error) {
      console.error('Error fetching layers:', error);
      return [];
    }
  }
}
