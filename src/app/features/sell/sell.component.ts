import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

import {
  LoanStatus,
  SellerLeadConfirmation,
  SellerOffer,
  SellerVehicleInput,
  VehicleCondition,
} from '../../core/models/selling';
import { SellingService } from '../../core/services/selling.service';

@Component({
  selector: 'app-sell',
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css',
})
export class SellComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly sellingService = inject(SellingService);

  protected readonly conditionOptions: VehicleCondition[] = [
    'Excellent',
    'Good',
    'Fair',
    'Needs work',
  ];
  protected readonly loanStatusOptions: LoanStatus[] = ['Owned outright', 'Loan or lease', 'Not sure'];
  protected readonly steps = toSignal(this.sellingService.getSellingSteps(), { initialValue: [] });
  protected readonly offer = signal<SellerOffer | null>(null);
  protected readonly confirmation = signal<SellerLeadConfirmation | null>(null);
  protected readonly submitting = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly sellForm = this.fb.group({
    year: [2022, [Validators.required, Validators.min(1990), Validators.max(2026)]],
    make: ['Toyota', [Validators.required, Validators.minLength(2)]],
    model: ['RAV4', [Validators.required, Validators.minLength(1)]],
    mileage: [36000, [Validators.required, Validators.min(0), Validators.max(400000)]],
    condition: ['Good' as VehicleCondition, [Validators.required]],
    zipCode: ['48201', [Validators.required, Validators.pattern(/^\d{5}$/)]],
    loanStatus: ['Owned outright' as LoanStatus, [Validators.required]],
  });

  protected calculateOffer(): void {
    this.sellForm.markAllAsTouched();
    this.confirmation.set(null);

    if (this.sellForm.invalid) {
      this.offer.set(null);
      this.error.set('Enter a valid vehicle profile to calculate the mock offer.');
      return;
    }

    this.error.set(null);
    this.sellingService.estimateVehicle(this.formValue()).subscribe({
      next: (offer) => this.offer.set(offer),
      error: () => this.error.set('The mock valuation service could not calculate an offer.'),
    });
  }

  protected submitLead(): void {
    const offer = this.offer();

    if (!offer || this.sellForm.invalid) {
      return;
    }

    this.submitting.set(true);
    this.sellingService.submitSellerLead(this.formValue(), offer).subscribe({
      next: (confirmation) => this.confirmation.set(confirmation),
      error: () => this.error.set('The mock seller lead could not be saved.'),
      complete: () => this.submitting.set(false),
    });
  }

  private formValue(): SellerVehicleInput {
    return this.sellForm.getRawValue();
  }
}
