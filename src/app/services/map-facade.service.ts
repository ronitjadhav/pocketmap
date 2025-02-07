import { Injectable } from '@angular/core';
import { createMapFromContext, applyContextDiffToMap } from '@geospatial-sdk/openlayers';
import { computeMapContextDiff } from '@geospatial-sdk/core';
import { BehaviorSubject } from 'rxjs';

const DEFAULT_BASEMAP = { 
    type: 'xyz', 
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
    name: 'OSM Basemap'
  }

  @Injectable({
    providedIn: 'root'
  })
  export class MapFacadeService {
    // The map context starts with a default view and the permanent basemap.
    private contextSubject = new BehaviorSubject<any>({
      view: { zoom: 5, center: [6, 48.5] },
      layers: [DEFAULT_BASEMAP]
    });
    context$ = this.contextSubject.asObservable();
  
    // Declare the map instance as any.
    private map: any;
  
    // Create a promise that will resolve once the map is set.
    private _mapReadyResolver: (() => void) | null = null;
    public mapReady: Promise<void> = new Promise<void>((resolve) => {
      this._mapReadyResolver = resolve;
    });
  
    get currentContext() {
      return this.contextSubject.value;
    }
  
    setContext(newContext: any) {
      this.contextSubject.next(newContext);
    }
  
    // Call this method from your MapContainerComponent once the map is created.
    setMap(mapInstance: any) {
      this.map = mapInstance;
      // Resolve the promise so that updateOverlays can continue.
      if (this._mapReadyResolver) {
        this._mapReadyResolver();
        this._mapReadyResolver = null;
      }
    }
  
    // Update the overlay layers only.
    async updateOverlays(overlays: any[]) {
      // Wait until the map is ready.
      await this.mapReady;
      // Create a new context with the permanent basemap plus the overlay layers.
      const newContext = {
        ...this.currentContext,
        layers: [DEFAULT_BASEMAP, ...overlays]
      };
      // Compute and apply the diff to update the map.
      const diff = computeMapContextDiff(newContext, this.currentContext);
      await applyContextDiffToMap(this.map, diff);
      // Update our stored context.
      this.contextSubject.next(newContext);
    }
  }