import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import {
  VehicleActivityState,
  VehicleActivityStreamService,
} from '../buy/vehicle-activity-stream.service';
import { BidListPageHostComponent } from './bid-list-page-host.component';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

describe('BidListPageHostComponent', () => {
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

  it('renders the Angular bid list fallback when the React flag is disabled', async () => {
    const compiled = await setup(false);

    expect(compiled.textContent).toContain('4 active bids');
    expect(compiled.textContent).toContain('This app-owned feature reuses the buy result card');
    expect(compiled.querySelector('app-bid-list')).toBeTruthy();
  });

  it('renders the React bid list when the React flag is enabled', async () => {
    const compiled = await setup(true);

    await waitForText(compiled, 'Angular shell keeps routing and rollback control');

    expect(compiled.textContent).toContain('4 active bids');
    expect(compiled.textContent).toContain('RAV4 Hybrid XSE');
    expect(compiled.querySelector('app-react-bid-list-host')).toBeTruthy();
    expect(
      compiled.querySelector<HTMLAnchorElement>('a[href="/buy/rav4-hybrid-xse-2024"]'),
    ).toBeTruthy();
  });

  async function setup(reactEnabled: boolean): Promise<HTMLElement> {
    await TestBed.configureTestingModule({
      imports: [BidListPageHostComponent],
      providers: [
        provideRouter([]),
        {
          provide: FeatureFlagsService,
          useValue: {
            bidListReactEnabled: signal(reactEnabled),
          },
        },
        {
          provide: VehicleActivityStreamService,
          useValue: { connect: vi.fn(() => activityState.asObservable()) },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(BidListPageHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    return fixture.nativeElement as HTMLElement;
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
