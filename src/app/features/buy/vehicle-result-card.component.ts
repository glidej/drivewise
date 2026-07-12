import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Vehicle, VehicleBidStatus, VehicleBidSummary } from '@drivewise/common-data';
import { switchMap } from 'rxjs';

import {
  EMPTY_VEHICLE_ACTIVITY_STATE,
  VehicleActivityStreamService,
} from './vehicle-activity-stream.service';

export type VehicleResultCardMode = 'inventory' | 'bid-list';

@Component({
  selector: 'app-vehicle-result-card',
  imports: [CurrencyPipe, DatePipe, DecimalPipe, RouterLink],
  templateUrl: './vehicle-result-card.component.html',
  styleUrl: './vehicle-result-card.component.scss',
})
export class VehicleResultCardComponent {
  private readonly activityStream = inject(VehicleActivityStreamService);

  readonly vehicle = input.required<Vehicle>();
  readonly mode = input<VehicleResultCardMode>('inventory');
  readonly bid = input<VehicleBidSummary | null>(null);

  protected readonly activityExpanded = signal(false);
  protected readonly activity = toSignal(
    toObservable(this.vehicle).pipe(switchMap((vehicle) => this.activityStream.connect(vehicle))),
    { initialValue: EMPTY_VEHICLE_ACTIVITY_STATE },
  );
  protected readonly showBidSummary = computed(() => this.mode() === 'bid-list' && this.bid());
  protected readonly bidBuffer = computed(() => {
    const bid = this.bid();

    return bid ? bid.maxAutoBid - bid.amount : 0;
  });
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

  protected bidStatusLabel(status: VehicleBidStatus): string {
    switch (status) {
      case 'winning':
        return 'Winning bid';
      case 'outbid':
        return 'Outbid';
      case 'countered':
        return 'Dealer countered';
      default:
        return 'Watching auction';
    }
  }
}
