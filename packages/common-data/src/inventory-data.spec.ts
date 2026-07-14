import { describe, expect, it } from 'vitest';

import { MOCK_BID_RECORDS } from './bid-data';
import {
  getMockBidList,
  getMockVehicleById,
  getMockVehicles,
  searchMockVehicles,
} from './inventory-data';

describe('common inventory data', () => {
  it('returns defensive vehicle copies', () => {
    const vehicles = getMockVehicles();
    vehicles[0].tags[0] = 'Mutated';
    vehicles[0].history.owners = 99;

    const nextVehicles = getMockVehicles();

    expect(nextVehicles[0].tags).toContain('Low mileage');
    expect(nextVehicles[0].history.owners).toBe(1);
  });

  it('searches vehicles with the same filter shape as the Angular inventory service', () => {
    const results = searchMockVehicles({ query: 'hybrid', fuelType: 'Hybrid', maxPrice: 30000 });

    expect(results.map((vehicle) => vehicle.id)).toEqual(['prius-limited-2022']);
  });

  it('maps mock bid records to defensive vehicle copies', () => {
    const bids = getMockBidList();

    expect(bids.length).toBe(4);
    expect(bids[0].vehicle.model).toBe('RAV4 Hybrid');
    expect(bids.map((bid) => bid.status)).toContain('countered');
    expect(bids.map((bid) => bid.status)).toContain('outbid');

    bids[0].vehicle.tags[0] = 'Mutated';
    const nextBids = getMockBidList();

    expect(nextBids[0].vehicle.tags).toContain('Low mileage');
  });

  it('omits bid records without a matching vehicle', () => {
    const bids = getMockBidList([{ ...MOCK_BID_RECORDS[0], vehicleId: 'missing-vehicle' }]);

    expect(bids).toEqual([]);
  });

  it('returns vehicle copies by id', () => {
    const vehicle = getMockVehicleById('rav4-hybrid-xse-2024');

    expect(vehicle?.model).toBe('RAV4 Hybrid');
    vehicle!.tags[0] = 'Mutated';

    expect(getMockVehicleById('rav4-hybrid-xse-2024')?.tags).toContain('Low mileage');
  });
});
