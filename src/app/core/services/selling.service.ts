import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';

import { MOCK_SELLING_STEPS } from '../data/mock-selling';
import {
  SellerLeadConfirmation,
  SellerOffer,
  SellerVehicleInput,
  SellingStep,
  VehicleCondition,
} from '../models/selling';

const CURRENT_MODEL_YEAR = 2026;

@Injectable({ providedIn: 'root' })
export class SellingService {
  getSellingSteps(): Observable<SellingStep[]> {
    return defer(() => of(MOCK_SELLING_STEPS.map((step) => ({ ...step }))));
  }

  estimateVehicle(input: SellerVehicleInput): Observable<SellerOffer> {
    return defer(() => of(this.buildOffer(input)));
  }

  submitSellerLead(
    input: SellerVehicleInput,
    offer: SellerOffer,
  ): Observable<SellerLeadConfirmation> {
    const confirmationId = `${offer.referenceId}-CONF`;
    const nextContactWindow =
      input.loanStatus === 'Loan or lease' ? 'Tomorrow 9 AM - noon' : 'Today 2 PM - 5 PM';

    return defer(() =>
      of({
        confirmationId,
        status: 'Draft saved' as const,
        nextContactWindow,
      }),
    );
  }

  private buildOffer(input: SellerVehicleInput): SellerOffer {
    const baseValue = this.baseValueFor(input.make, input.model);
    const age = Math.max(CURRENT_MODEL_YEAR - input.year, 0);
    const mileagePenalty = Math.max(input.mileage - 12000 * Math.max(age, 1), 0) * 0.08;
    const ageAdjustment = Math.max(0.55, 1 - age * 0.055);
    const conditionAdjustment = this.conditionMultiplier(input.condition);
    const demandScore = this.demandScore(input.make, input.zipCode);
    const demandMultiplier = 0.92 + demandScore / 1000;
    const loanAdjustment = input.loanStatus === 'Loan or lease' ? 0.97 : 1;
    const instantOffer = Math.round(
      Math.max(
        1500,
        (baseValue * ageAdjustment * conditionAdjustment * demandMultiplier - mileagePenalty) *
          loanAdjustment,
      ),
    );

    return {
      referenceId: this.referenceId(input),
      instantOffer,
      privatePartyRangeLow: Math.round(instantOffer * 1.06),
      privatePartyRangeHigh: Math.round(instantOffer * 1.18),
      demandScore,
      conditionAdjustment: Math.round((conditionAdjustment - 1) * 100),
      nextSteps: [
        'Upload exterior and interior photos',
        'Confirm title and payoff status',
        'Choose drop-off or pickup preference',
      ],
    };
  }

  private baseValueFor(make: string, model: string): number {
    const key = `${make} ${model}`.toLowerCase();

    if (key.includes('tesla') || key.includes('model')) {
      return 35500;
    }

    if (key.includes('truck') || key.includes('f-150') || key.includes('silverado')) {
      return 37500;
    }

    if (key.includes('rav4') || key.includes('cr-v') || key.includes('forester')) {
      return 30500;
    }

    if (key.includes('accord') || key.includes('camry')) {
      return 25500;
    }

    return 22500;
  }

  private conditionMultiplier(condition: VehicleCondition): number {
    const multipliers: Record<VehicleCondition, number> = {
      Excellent: 1.08,
      Good: 1,
      Fair: 0.88,
      'Needs work': 0.68,
    };

    return multipliers[condition];
  }

  private demandScore(make: string, zipCode: string): number {
    const makeBoost = ['toyota', 'honda', 'tesla', 'ford'].includes(make.toLowerCase()) ? 86 : 74;
    const regionBoost = zipCode.startsWith('48') ? 7 : 2;

    return Math.min(makeBoost + regionBoost, 99);
  }

  private referenceId(input: SellerVehicleInput): string {
    const slug = `${input.year}-${input.make}-${input.model}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `DW-SELL-${slug}-${input.mileage}`;
  }
}
