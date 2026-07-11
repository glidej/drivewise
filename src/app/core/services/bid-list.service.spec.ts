import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { BidListService } from './bid-list.service';

describe('BidListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('maps mock bid records to full vehicle card data', async () => {
    const service = TestBed.inject(BidListService);

    const bids = await firstValueFrom(service.getBidList());

    expect(bids.length).toBe(4);
    expect(bids[0].vehicle.model).toBe('RAV4 Hybrid');
    expect(bids.map((bid) => bid.status)).toContain('countered');
    expect(bids.map((bid) => bid.status)).toContain('outbid');
  });

  it('returns defensive vehicle copies for bid cards', async () => {
    const service = TestBed.inject(BidListService);

    const bids = await firstValueFrom(service.getBidList());
    bids[0].vehicle.tags[0] = 'Mutated';

    const nextBids = await firstValueFrom(service.getBidList());

    expect(nextBids[0].vehicle.tags).toContain('Low mileage');
  });
});
