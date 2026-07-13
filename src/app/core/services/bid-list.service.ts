import { Injectable, inject } from '@angular/core';
import { buildBidList, MOCK_BID_RECORDS } from '@drivewise/common-data';
import { map, Observable } from 'rxjs';

import { VehicleBidListItem } from '../models/bid';
import { InventoryService } from './inventory.service';

@Injectable({ providedIn: 'root' })
export class BidListService {
  private readonly inventoryService = inject(InventoryService);

  getBidList(): Observable<VehicleBidListItem[]> {
    return this.inventoryService
      .getVehicles()
      .pipe(map((vehicles) => buildBidList(MOCK_BID_RECORDS, vehicles)));
  }
}
