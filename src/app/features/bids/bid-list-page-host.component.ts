import { Component, inject } from '@angular/core';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { BidListComponent } from './bid-list.component';
import { ReactBidListHostComponent } from './react-bid-list-host.component';

@Component({
  selector: 'app-bid-list-page-host',
  imports: [BidListComponent, ReactBidListHostComponent],
  template: `
    @if (bidsReactEnabled()) {
      <app-react-bid-list-host />
    } @else {
      <app-bid-list />
    }
  `,
})
export class BidListPageHostComponent {
  protected readonly bidsReactEnabled = inject(FeatureFlagsService).bidsReactEnabled;
}
