import { Vehicle } from './vehicle';

export type VehicleBidStatus = 'winning' | 'outbid' | 'countered' | 'watching';

export interface VehicleBidSummary {
  id: string;
  amount: number;
  maxAutoBid: number;
  status: VehicleBidStatus;
  placedAt: string;
  expiresAt: string;
  competingBids: number;
  rank: number;
  dealerCounterOffer?: number;
}

export interface VehicleBidRecord extends VehicleBidSummary {
  vehicleId: string;
}

export interface VehicleBidListItem extends VehicleBidSummary {
  vehicle: Vehicle;
}
