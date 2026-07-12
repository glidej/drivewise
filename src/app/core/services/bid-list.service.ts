import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { buildBidList, MOCK_BID_RECORDS, VehicleBidListItem } from '@drivewise/common-data';
import { InventoryService } from './inventory.service';

@Injectable({ providedIn: 'root' })
export class BidListService {
  private readonly inventoryService = inject(InventoryService);

  getBidList(): Observable<VehicleBidListItem[]> {
    return this.inventoryService.getVehicles().pipe(map((vehicles) => buildBidList(MOCK_BID_RECORDS, vehicles)));
  }
}
