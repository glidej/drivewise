import { describe, expect, it } from 'vitest';
import { buildBidList } from './bids';
import { MOCK_BID_RECORDS } from './mock-bids';
import { MOCK_VEHICLES } from './mock-vehicles';

describe('buildBidList', () => {
  it('joins bids to defensive vehicle copies', () => {
    const bids = buildBidList(MOCK_BID_RECORDS, MOCK_VEHICLES);
    expect(bids).toHaveLength(4);
    bids[0].vehicle.tags[0] = 'changed';
    expect(buildBidList(MOCK_BID_RECORDS, MOCK_VEHICLES)[0].vehicle.tags).toContain('Low mileage');
  });
});
