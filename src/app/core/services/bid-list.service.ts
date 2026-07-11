import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { MOCK_BID_RECORDS } from '../data/mock-bids';
import { VehicleBidListItem, VehicleBidRecord } from '../models/bid';
import { Vehicle } from '../models/vehicle';
import { InventoryService } from './inventory.service';

@Injectable({ providedIn: 'root' })
export class BidListService {
  private readonly inventoryService = inject(InventoryService);

  getBidList(): Observable<VehicleBidListItem[]> {
    return this.inventoryService.getVehicles().pipe(
      map((vehicles) => {
        const vehiclesById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));

        return MOCK_BID_RECORDS.flatMap((bid) => {
          const vehicle = vehiclesById.get(bid.vehicleId);

          return vehicle ? [this.toBidListItem(bid, vehicle)] : [];
        });
      }),
    );
  }

  private toBidListItem(bid: VehicleBidRecord, vehicle: Vehicle): VehicleBidListItem {
    return {
      ...bid,
      vehicle: {
        ...vehicle,
        features: [...vehicle.features],
        history: { ...vehicle.history },
        location: { ...vehicle.location },
        tags: [...vehicle.tags],
      },
    };
  }
}
