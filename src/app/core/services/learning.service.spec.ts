import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { LearningService } from './learning.service';

describe('LearningService', () => {
  let service: LearningService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LearningService);
  });

  it('returns defensive copies of guide highlights', async () => {
    const firstResult = await firstValueFrom(service.getBuyingGuides());
    firstResult[0].highlights.push('Unexpected edit');

    const secondResult = await firstValueFrom(service.getBuyingGuides());

    expect(secondResult[0].highlights).not.toContain('Unexpected edit');
  });

  it('estimates monthly payments from mocked calculator inputs', () => {
    const payment = service.estimateMonthlyPayment({
      price: 32000,
      downPayment: 4000,
      apr: 6.4,
      termMonths: 60,
    });

    expect(payment).toBe(547);
  });

  it('handles zero APR payment estimates', () => {
    const payment = service.estimateMonthlyPayment({
      price: 24000,
      downPayment: 6000,
      apr: 0,
      termMonths: 36,
    });

    expect(payment).toBe(500);
  });
});
