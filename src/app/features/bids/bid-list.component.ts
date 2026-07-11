import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { BidListService } from '../../core/services/bid-list.service';
import { VehicleResultCardComponent } from '../buy/vehicle-result-card.component';

@Component({
  selector: 'app-bid-list',
  imports: [VehicleResultCardComponent],
  templateUrl: './bid-list.component.html',
  styleUrl: './bid-list.component.scss',
})
export class BidListComponent {
  private readonly bidListService = inject(BidListService);

  protected readonly bids = toSignal(this.bidListService.getBidList(), { initialValue: [] });
}
