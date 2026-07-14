import type { Vehicle } from '@drivewise/common-data';

export type {
  Vehicle,
  VehicleBidListItem,
  VehicleBidStatus,
  VehicleBidSummary,
} from '@drivewise/common-data';

export interface BidListPageProps {
  detailHrefForVehicle: (vehicle: Vehicle) => string;
}

export interface BidListReactMount {
  update(props: BidListPageProps): void;
  unmount(): void;
}
