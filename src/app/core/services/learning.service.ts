import { Injectable } from '@angular/core';
import { defer, Observable, of } from 'rxjs';

import { MOCK_BUYING_GUIDES, MOCK_LEARNING_STEPS } from '../data/mock-learning';
import { BuyingGuide, LearningStep, PaymentEstimate } from '../models/learning';

@Injectable({ providedIn: 'root' })
export class LearningService {
  getBuyingGuides(): Observable<BuyingGuide[]> {
    return defer(() =>
      of(
        MOCK_BUYING_GUIDES.map((guide) => ({
          ...guide,
          highlights: [...guide.highlights],
        })),
      ),
    );
  }

  getLearningSteps(): Observable<LearningStep[]> {
    return defer(() => of(MOCK_LEARNING_STEPS.map((step) => ({ ...step }))));
  }

  estimateMonthlyPayment(estimate: PaymentEstimate): number {
    const principal = Math.max(estimate.price - estimate.downPayment, 0);

    if (principal === 0) {
      return 0;
    }

    if (estimate.apr <= 0) {
      return principal / estimate.termMonths;
    }

    const monthlyRate = estimate.apr / 100 / 12;
    const payment =
      (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -estimate.termMonths));

    return Math.round(payment);
  }
}
