import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { LearningService } from '../../core/services/learning.service';

@Component({
  selector: 'app-learn',
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss',
})
export class LearnComponent {
  private readonly learningService = inject(LearningService);

  protected readonly guides = toSignal(this.learningService.getBuyingGuides(), { initialValue: [] });
  protected readonly steps = toSignal(this.learningService.getLearningSteps(), { initialValue: [] });

  protected vehiclePrice = 32000;
  protected downPayment = 4000;
  protected apr = 6.4;
  protected termMonths = 60;

  protected get estimatedPayment(): number {
    return this.learningService.estimateMonthlyPayment({
      price: this.vehiclePrice,
      downPayment: this.downPayment,
      apr: this.apr,
      termMonths: this.termMonths,
    });
  }
}
