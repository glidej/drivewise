import { describe, expect, it } from 'vitest';

import {
  buildBidList,
  buildInitialVehicleActivityState,
  buildVehicleActivityEvent,
  MOCK_BID_RECORDS,
  MOCK_VEHICLES,
  reduceVehicleActivityState,
} from './index';

describe('common vehicle data', () => {
  it('builds active bids from mock records and vehicles', () => {
    const bids = buildBidList();

    expect(bids).toHaveLength(MOCK_BID_RECORDS.length);
    expect(bids[0]?.vehicle.model).toBe('RAV4 Hybrid');
    expect(bids.map((bid) => bid.status)).toContain('countered');
  });

  it('returns defensive vehicle copies for bid list items', () => {
    const bids = buildBidList();
    bids[0]!.vehicle.tags[0] = 'Mutated';

    const nextBids = buildBidList();

    expect(nextBids[0]?.vehicle.tags).toContain('Low mileage');
  });

  it('builds deterministic live activity snapshots', () => {
    const vehicle = MOCK_VEHICLES[0]!;
    const initial = buildInitialVehicleActivityState(vehicle);
    const event = buildVehicleActivityEvent(vehicle, 0);
    const next = reduceVehicleActivityState(vehicle, initial, event);

    expect(initial.connection).toBe('connecting');
    expect(next.recentEvents[0]).toEqual(event);
  });
});
