import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { createMapFromContext, applyContextDiffToMap } from '@geospatial-sdk/openlayers';
import { computeMapContextDiff } from '@geospatial-sdk/core';

export const DEFAULT_BASEMAP = { 
  type: 'xyz', 
  url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png', 
  name: 'OSM Basemap'
};

@Injectable({
  providedIn: 'root'
})
export class MapContextService {
  private _contextSubject = new BehaviorSubject<any>({
    view: { zoom: 5, center: [6, 48.5] },
    // Start with the basemap always present.
    layers: [DEFAULT_BASEMAP]
  });
  context$ = this._contextSubject.asObservable();

  get currentContext() {
    return this._contextSubject.value;
  }

  setContext(newContext: any) {
    this._contextSubject.next(newContext);
  }

  async updateContext(newContext: any, mapInstance: any) {
    if (!mapInstance) {
      console.error('Map instance is not provided.');
      return;
    }
    const diff = computeMapContextDiff(newContext, this.currentContext);
    await applyContextDiffToMap(mapInstance, diff);
    this.setContext(newContext);
  }
}