import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { vi } from 'vitest';

import { Vehicle } from '../../core/models/vehicle';
import {
  VehicleActivityState,
  VehicleActivityStreamService,
} from './vehicle-activity-stream.service';
import { VehicleResultCardComponent } from './vehicle-result-card.component';

describe('VehicleResultCardComponent', () => {
  let activityState: BehaviorSubject<VehicleActivityState>;
  let connect: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    activityState = new BehaviorSubject<VehicleActivityState>(liveActivityState);
    connect = vi.fn(() => activityState.asObservable());

    await TestBed.configureTestingModule({
      imports: [VehicleResultCardComponent],
      providers: [
        provideRouter([]),
        {
          provide: VehicleActivityStreamService,
          useValue: { connect },
        },
      ],
    }).compileComponents();
  });

  afterEach(() => {
    activityState.complete();
  });

  it('renders vehicle summary details and a details link', () => {
    const fixture = TestBed.createComponent(VehicleResultCardComponent);
    fixture.componentRef.setInput('vehicle', vehicle);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const image = compiled.querySelector('img');
    const detailsLink = compiled.querySelector<HTMLAnchorElement>('.details-link');

    expect(compiled.textContent).toContain('2024 Toyota');
    expect(compiled.textContent).toContain('RAV4 Hybrid XSE');
    expect(compiled.textContent).toContain('$38,900');
    expect(compiled.textContent).toContain('18,200 mi');
    expect(compiled.textContent).toContain('Hybrid');
    expect(compiled.textContent).toContain('Ann Arbor, MI');
    expect(compiled.textContent).toContain('18 mi away');
    expect(compiled.textContent).toContain('Drivewise Ann Arbor');
    expect(compiled.textContent).toContain('Rated 4.8');
    expect(compiled.textContent).toContain('Featured match');
    expect(compiled.textContent).toContain('Certified');
    expect(compiled.textContent).toContain('Live dealer activity');
    expect(compiled.textContent).toContain('High shopper demand');
    expect(compiled.textContent).toContain('31');
    expect(image?.getAttribute('src')).toBe(vehicle.imageUrl);
    expect(image?.getAttribute('alt')).toBe(vehicle.imageAlt);
    expect(image?.getAttribute('loading')).toBe('lazy');
    expect(detailsLink?.getAttribute('href')).toBe('/buy/rav4-hybrid-xse');
    expect(connect).toHaveBeenCalledWith(vehicle);
  });

  it('switches live activity rendering from stream state changes', () => {
    const fixture = TestBed.createComponent(VehicleResultCardComponent);
    fixture.componentRef.setInput('vehicle', vehicle);
    fixture.detectChanges();

    activityState.next({
      ...liveActivityState,
      connection: 'reconnecting',
      marketSignal: 'price-drop',
      priceDelta: -650,
      recentEvents: [
        {
          id: 'price-drop-1',
          kind: 'price',
          label: 'Dealer price moved $650',
          sequence: 7,
          watcherDelta: 0,
          saveDelta: 0,
          priceDelta: -650,
        },
      ],
    });
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector<HTMLButtonElement>('.activity-toggle');

    expect(compiled.textContent).toContain('Reconnecting to dealer activity');
    expect(compiled.textContent).toContain('Price movement detected');
    expect(compiled.textContent).toContain('Price pulse');

    toggle?.click();
    fixture.detectChanges();

    expect(compiled.textContent).toContain('Dealer price moved $650');
    expect(compiled.textContent).toContain('event 7');
  });
});

const liveActivityState: VehicleActivityState = {
  connection: 'live',
  marketSignal: 'high-demand',
  watchers: 31,
  savesToday: 7,
  priceDelta: 0,
  recentEvents: [
    {
      id: 'watcher-1',
      kind: 'watcher',
      label: '3 shoppers joined this SUV listing',
      sequence: 2,
      watcherDelta: 3,
      saveDelta: 0,
      priceDelta: 0,
    },
  ],
};

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
