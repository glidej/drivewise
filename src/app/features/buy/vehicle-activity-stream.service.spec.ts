import { afterEach, vi } from 'vitest';

import { Vehicle } from '@drivewise/common-data';
import {
  VehicleActivityStreamService,
  buildInitialVehicleActivityState,
} from './vehicle-activity-stream.service';

describe('VehicleActivityStreamService', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('builds a deterministic initial activity snapshot from vehicle data', () => {
    const snapshot = buildInitialVehicleActivityState(vehicle);

    expect(snapshot.connection).toBe('connecting');
    expect(snapshot.marketSignal).toBe('high-demand');
    expect(snapshot.watchers).toBeGreaterThan(8);
    expect(snapshot.recentEvents[0].label).toBe('Opening mock dealer activity socket');
  });

  it('simulates a dealer websocket with connection and event updates', async () => {
    vi.useFakeTimers();
    const service = new VehicleActivityStreamService();
    const snapshots: string[] = [];

    const subscription = service.connect(vehicle).subscribe((state) => {
      snapshots.push(`${state.connection}:${state.recentEvents[0]?.kind}:${state.watchers}`);
    });

    expect(snapshots[0]).toContain('connecting:heartbeat');

    await vi.advanceTimersByTimeAsync(0);
    expect(snapshots.at(-1)).toContain('connecting:');

    await vi.advanceTimersByTimeAsync(300);
    expect(snapshots.at(-1)).toContain('live:');

    await vi.advanceTimersByTimeAsync(1800);
    expect(snapshots.some((snapshot) => snapshot.startsWith('reconnecting:'))).toBe(true);

    subscription.unsubscribe();
  });
});

const vehicle: Vehicle = {
  id: 'rav4-hybrid-xse',
  vin: '2T3E6RFV0RW123456',
  stockNumber: 'DW-2401',
  year: 2024,
  make: 'Toyota',
  model: 'RAV4 Hybrid',
  trim: 'XSE',
  price: 38900,
  mileage: 18200,
  bodyStyle: 'SUV',
  drivetrain: 'AWD',
  fuelType: 'Hybrid',
  transmission: 'Automatic',
  exteriorColor: 'Blueprint',
  interiorColor: 'Black SofTex',
  mpgCity: 41,
  mpgHighway: 38,
  imageUrl: 'https://example.com/rav4.jpg',
  imageAlt: 'Blue Toyota RAV4 Hybrid parked outside',
  location: {
    city: 'Ann Arbor',
    state: 'MI',
    distanceMiles: 18,
  },
  dealerName: 'Drivewise Ann Arbor',
  rating: 4.8,
  features: ['Heated seats'],
  tags: ['Certified', 'One owner'],
  history: {
    owners: 1,
    accidentFree: true,
    serviceRecords: 6,
  },
  sellerNotes: 'A clean mock vehicle for component tests.',
  highlighted: true,
};
