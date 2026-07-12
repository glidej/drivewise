import { Injectable } from '@angular/core';
import { defer, map, Observable, of } from 'rxjs';
import { cloneVehicle, InventoryFilters, MOCK_VEHICLES, Vehicle } from '@drivewise/common-data';

@Injectable({ providedIn: 'root' })
export class InventoryService {
  getVehicles(): Observable<Vehicle[]> {
    return defer(() => of(MOCK_VEHICLES.map(cloneVehicle)));
  }

  getFeaturedVehicles(limit = 3): Observable<Vehicle[]> {
    return this.getVehicles().pipe(
      map((vehicles) => vehicles.filter((vehicle) => vehicle.highlighted).slice(0, limit)),
    );
  }

  getVehicleById(id: string): Observable<Vehicle | undefined> {
    return this.getVehicles().pipe(map((vehicles) => vehicles.find((vehicle) => vehicle.id === id)));
  }

  searchVehicles(filters: InventoryFilters = {}): Observable<Vehicle[]> {
    return this.getVehicles().pipe(
      map((vehicles) =>
        vehicles.filter((vehicle) => {
          const matchesQuery = this.matchesQuery(vehicle, filters.query);
          const matchesBody = !filters.bodyStyle || filters.bodyStyle === 'Any' || vehicle.bodyStyle === filters.bodyStyle;
          const matchesFuel = !filters.fuelType || filters.fuelType === 'Any' || vehicle.fuelType === filters.fuelType;
          const matchesPrice = !filters.maxPrice || vehicle.price <= filters.maxPrice;
          const matchesMileage = !filters.maxMileage || vehicle.mileage <= filters.maxMileage;
          const matchesYear = !filters.minYear || vehicle.year >= filters.minYear;

          return (
            matchesQuery &&
            matchesBody &&
            matchesFuel &&
            matchesPrice &&
            matchesMileage &&
            matchesYear
          );
        }),
      ),
    );
  }

  private matchesQuery(vehicle: Vehicle, query = ''): boolean {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return true;
    }

    return [
      vehicle.year,
      vehicle.make,
      vehicle.model,
      vehicle.trim,
      vehicle.bodyStyle,
      vehicle.fuelType,
      vehicle.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase()
      .includes(normalizedQuery);
  }

}
