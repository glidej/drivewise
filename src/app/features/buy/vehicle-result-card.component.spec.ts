import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Vehicle } from '../../core/models/vehicle';
import { VehicleResultCardComponent } from './vehicle-result-card.component';

describe('VehicleResultCardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleResultCardComponent],
      providers: [provideRouter([])],
    }).compileComponents();
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
    expect(image?.getAttribute('src')).toBe(vehicle.imageUrl);
    expect(image?.getAttribute('alt')).toBe(vehicle.imageAlt);
    expect(image?.getAttribute('loading')).toBe('lazy');
    expect(detailsLink?.getAttribute('href')).toBe('/buy/rav4-hybrid-xse');
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
