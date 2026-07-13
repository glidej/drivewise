import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import {
  VehicleActivityState,
  VehicleActivityStreamService,
} from '../buy/vehicle-activity-stream.service';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { BidListComponent } from './bid-list.component';

describe('BidListComponent', () => {
  let activityState: BehaviorSubject<VehicleActivityState>;

  beforeEach(() => {
    activityState = new BehaviorSubject<VehicleActivityState>({
      connection: 'live',
      marketSignal: 'watching',
      watchers: 12,
      savesToday: 3,
      priceDelta: 0,
      recentEvents: [],
    });
  });

  afterEach(() => {
    activityState.complete();
  });

  it('renders bid vehicles through the reusable result card', async () => {
    const fixture = await setup(false);
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('4 active bids');
    expect(compiled.textContent).toContain('RAV4 Hybrid XSE');
    expect(compiled.textContent).toContain('Bid desk');
    expect(compiled.textContent).toContain('Winning bid');
    expect(compiled.textContent).toContain('Dealer countered');
    expect(compiled.querySelectorAll('app-vehicle-result-card').length).toBe(4);
  });

  it('renders the React bid list when the React flag is enabled', async () => {
    const fixture = await setup(true);
    const compiled = fixture.nativeElement as HTMLElement;

    await waitForText(compiled, 'Review each active bid');

    expect(compiled.textContent).toContain('4 active bids');
    expect(compiled.textContent).toContain('RAV4 Hybrid XSE');
    expect(compiled.querySelector('app-react-bid-list-host')).not.toBeNull();
  });

  async function setup(reactEnabled: boolean) {
    await TestBed.configureTestingModule({
      imports: [BidListComponent],
      providers: [
        provideRouter([]),
        {
          provide: FeatureFlagsService,
          useValue: {
            bidsReactEnabled: signal(reactEnabled),
          },
        },
        {
          provide: VehicleActivityStreamService,
          useValue: { connect: vi.fn(() => activityState.asObservable()) },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BidListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    return fixture;
  }
});

async function waitForText(element: HTMLElement, text: string): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (element.textContent?.includes(text)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  throw new Error(`Timed out waiting for "${text}"`);
}
