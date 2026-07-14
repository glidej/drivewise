import { Injectable } from '@angular/core';
import {
  getFeaturedMockVehicles,
  getMockVehicleById,
  getMockVehicles,
  searchMockVehicles,
} from '@drivewise/common-data';
import { defer, Observable, of } from 'rxjs';

import { InventoryFilters, Vehicle } from '../models/vehicle';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  getVehicles(): Observable<Vehicle[]> {
    return defer(() => of(getMockVehicles()));
  }

  getFeaturedVehicles(limit = 3): Observable<Vehicle[]> {
    return defer(() => of(getFeaturedMockVehicles(limit)));
  }

  getVehicleById(id: string): Observable<Vehicle | undefined> {
    return defer(() => of(getMockVehicleById(id)));
  }

  searchVehicles(filters: InventoryFilters = {}): Observable<Vehicle[]> {
    return defer(() => of(searchMockVehicles(filters)));
  }
}
