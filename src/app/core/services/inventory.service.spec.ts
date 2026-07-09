import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { InventoryService } from './inventory.service';

describe('InventoryService', () => {
  let service: InventoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryService);
  });

  it('returns defensive copies of the mock inventory', async () => {
    const firstResult = await firstValueFrom(service.getVehicles());
    firstResult[0].features.push('Mutated in test');

    const secondResult = await firstValueFrom(service.getVehicles());

    expect(secondResult[0].features).not.toContain('Mutated in test');
  });

  it('filters inventory by query, body style, fuel type, price, mileage, and year', async () => {
    const results = await firstValueFrom(
      service.searchVehicles({
        query: 'toyota',
        bodyStyle: 'SUV',
        fuelType: 'Hybrid',
        maxPrice: 40000,
        maxMileage: 10000,
        minYear: 2024,
      }),
    );

    expect(results.map((vehicle) => vehicle.id)).toEqual(['rav4-hybrid-xse-2024']);
  });

  it('finds a vehicle by id', async () => {
    const vehicle = await firstValueFrom(service.getVehicleById('model-3-long-range-2023'));

    expect(vehicle?.make).toBe('Tesla');
    expect(vehicle?.rangeMiles).toBe(333);
  });
});
