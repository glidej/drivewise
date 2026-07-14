import { Injectable } from '@angular/core';
import { getMockBidList } from '@drivewise/common-data';
import { defer, Observable, of } from 'rxjs';

import { VehicleBidListItem } from '../models/bid';

@Injectable({ providedIn: 'root' })
export class BidListService {
  getBidList(): Observable<VehicleBidListItem[]> {
    return defer(() => of(getMockBidList()));
  }
}
