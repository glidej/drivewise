import { describe, expect, it } from 'vitest';

import { buildBidList } from '@drivewise/common-data';

import { bidStatusLabel } from './BidSummary';

describe('BidSummary', () => {
  it('maps bid statuses to visible labels', () => {
    expect(bidStatusLabel('winning')).toBe('Winning bid');
    expect(bidStatusLabel('outbid')).toBe('Outbid');
    expect(bidStatusLabel('countered')).toBe('Dealer countered');
    expect(bidStatusLabel('watching')).toBe('Watching auction');
  });

  it('keeps bid fixtures available for summary rendering', () => {
    const bids = buildBidList();

    expect(bids.map((bid) => bid.status)).toContain('winning');
    expect(bids.map((bid) => bid.status)).toContain('countered');
  });
});
