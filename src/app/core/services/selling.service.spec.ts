import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { SellerVehicleInput } from '../models/selling';
import { SellingService } from './selling.service';

describe('SellingService', () => {
  let service: SellingService;
  const vehicle: SellerVehicleInput = {
    year: 2022,
    make: 'Toyota',
    model: 'RAV4',
    mileage: 36000,
    condition: 'Good',
    zipCode: '48201',
    loanStatus: 'Owned outright',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellingService);
  });

  it('estimates a deterministic mock offer from seller inputs', async () => {
    const offer = await firstValueFrom(service.estimateVehicle(vehicle));

    expect(offer.referenceId).toBe('DW-SELL-2022-toyota-rav4-36000');
    expect(offer.instantOffer).toBeGreaterThan(20000);
    expect(offer.demandScore).toBe(93);
  });

  it('adjusts value based on condition', async () => {
    const excellent = await firstValueFrom(
      service.estimateVehicle({ ...vehicle, condition: 'Excellent' }),
    );
    const needsWork = await firstValueFrom(
      service.estimateVehicle({ ...vehicle, condition: 'Needs work' }),
    );

    expect(excellent.instantOffer).toBeGreaterThan(needsWork.instantOffer);
  });

  it('submits a mocked seller lead confirmation', async () => {
    const offer = await firstValueFrom(service.estimateVehicle(vehicle));
    const confirmation = await firstValueFrom(service.submitSellerLead(vehicle, offer));

    expect(confirmation.confirmationId).toBe(`${offer.referenceId}-CONF`);
    expect(confirmation.status).toBe('Draft saved');
    expect(confirmation.nextContactWindow).toBe('Today 2 PM - 5 PM');
  });
});
