import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { BidListService } from '../../core/services/bid-list.service';
import { VehicleResultCardComponent } from '../buy/vehicle-result-card.component';
import { ReactBidListHostComponent } from './react-bid-list-host.component';

@Component({
  selector: 'app-bid-list',
  imports: [ReactBidListHostComponent, VehicleResultCardComponent],
  templateUrl: './bid-list.component.html',
  styleUrl: './bid-list.component.scss',
})
export class BidListComponent {
  private readonly featureFlags = inject(FeatureFlagsService);
  private readonly bidListService = inject(BidListService);

  protected readonly bidsReactEnabled = this.featureFlags.bidsReactEnabled;
  protected readonly bids = toSignal(this.bidListService.getBidList(), { initialValue: [] });
}
