import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { switchMap } from 'rxjs';

import { Vehicle } from '../../core/models/vehicle';
import {
  EMPTY_VEHICLE_ACTIVITY_STATE,
  VehicleActivityStreamService,
} from './vehicle-activity-stream.service';

@Component({
  selector: 'app-vehicle-result-card',
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './vehicle-result-card.component.html',
  styleUrl: './vehicle-result-card.component.scss',
})
export class VehicleResultCardComponent {
  private readonly activityStream = inject(VehicleActivityStreamService);

  readonly vehicle = input.required<Vehicle>();

  protected readonly activityExpanded = signal(false);
  protected readonly activity = toSignal(
    toObservable(this.vehicle).pipe(switchMap((vehicle) => this.activityStream.connect(vehicle))),
    { initialValue: EMPTY_VEHICLE_ACTIVITY_STATE },
  );
  protected readonly activitySummary = computed(() => {
    const activity = this.activity();

    switch (activity.marketSignal) {
      case 'price-drop':
        return 'Price movement detected';
      case 'high-demand':
        return 'High shopper demand';
      case 'reserved':
        return 'Appointment activity';
      default:
        return 'Steady listing activity';
    }
  });

  protected toggleActivity(): void {
    this.activityExpanded.update((expanded) => !expanded);
  }
}
