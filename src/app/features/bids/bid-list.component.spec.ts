import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import {
  VehicleActivityState,
  VehicleActivityStreamService,
} from '../buy/vehicle-activity-stream.service';
import { BidListComponent } from './bid-list.component';

describe('BidListComponent', () => {
  let activityState: BehaviorSubject<VehicleActivityState>;

  beforeEach(async () => {
    activityState = new BehaviorSubject<VehicleActivityState>({
      connection: 'live',
      marketSignal: 'watching',
      watchers: 12,
      savesToday: 3,
      priceDelta: 0,
      recentEvents: [],
    });

    await TestBed.configureTestingModule({
      imports: [BidListComponent],
      providers: [
        provideRouter([]),
        {
          provide: VehicleActivityStreamService,
          useValue: { connect: vi.fn(() => activityState.asObservable()) },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    activityState.complete();
  });

  it('renders bid vehicles through the reusable result card', async () => {
    const fixture = TestBed.createComponent(BidListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('4 active bids');
    expect(compiled.textContent).toContain('RAV4 Hybrid XSE');
    expect(compiled.textContent).toContain('Bid desk');
    expect(compiled.textContent).toContain('Winning bid');
    expect(compiled.textContent).toContain('Dealer countered');
    expect(compiled.querySelectorAll('app-vehicle-result-card').length).toBe(4);
  });
});
