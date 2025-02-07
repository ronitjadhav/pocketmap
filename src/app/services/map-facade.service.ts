// src/app/services/map-facade.service.ts
import { Injectable } from '@angular/core';
import { createMapFromContext, applyContextDiffToMap } from '@geospatial-sdk/openlayers';
import { computeMapContextDiff } from '@geospatial-sdk/core';
import { BehaviorSubject } from 'rxjs';
import { DEFAULT_BASEMAP } from '../constants';

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

  // Map instance (declared as any, using geospatial-sdk for map creation)
  private map: any;

  // Create a promise that resolves once the map is initialized.
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

  // Called by MapContainerComponent once the map is created.
  setMap(mapInstance: any) {
    this.map = mapInstance;
    if (this._mapReadyResolver) {
      this._mapReadyResolver();
      this._mapReadyResolver = null;
    }
  }

  // Update only the overlay layers. The basemap remains the first layer.
  async updateOverlays(overlays: any[]) {
    await this.mapReady;
    const newContext = {
      ...this.currentContext,
      layers: [this.currentContext.layers[0], ...overlays]
    };
    const diff = computeMapContextDiff(newContext, this.currentContext);
    await applyContextDiffToMap(this.map, diff);
    this.contextSubject.next(newContext);
  }

  // Update the basemap only while preserving the overlays.
  async updateBasemap(newBasemap: any) {
    await this.mapReady;
    const currentContext = this.currentContext;
    const overlays = currentContext.layers.slice(1);
    const newContext = { ...currentContext, layers: [newBasemap, ...overlays] };
    const diff = computeMapContextDiff(newContext, currentContext);
    await applyContextDiffToMap(this.map, diff);
    this.contextSubject.next(newContext);
  }

  // Initialize the map (called from MapContainerComponent).
  async initMap(mapRoot: HTMLElement) {
    const map = await createMapFromContext(this.currentContext, mapRoot);
    this.setMap(map);
  }
}
