import { Component, inject } from '@angular/core';

import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { BidListComponent } from './bid-list.component';
import { ReactBidListHostComponent } from './react-bid-list-host.component';

@Component({
  selector: 'app-bid-list-page-host',
  imports: [BidListComponent, ReactBidListHostComponent],
  templateUrl: './bid-list-page-host.component.html',
})
export class BidListPageHostComponent {
  private readonly featureFlags = inject(FeatureFlagsService);

  protected readonly bidListReactEnabled = this.featureFlags.bidListReactEnabled;
}
