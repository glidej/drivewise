import { describe, expect, it } from 'vitest';

import { fetchBidList } from './bid-list-service';

describe('fetchBidList', () => {
  it('returns the shared bid list contract with defensive vehicle copies', async () => {
    const bids = await fetchBidList();

    expect(bids.length).toBe(4);
    expect(bids[0].vehicle.model).toBe('RAV4 Hybrid');
    expect(bids.map((bid) => bid.status)).toContain('countered');

    bids[0].vehicle.tags[0] = 'Mutated';
    const nextBids = await fetchBidList();

    expect(nextBids[0].vehicle.tags).toContain('Low mileage');
  });
});
