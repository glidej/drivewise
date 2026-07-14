import { getMockBidList, VehicleBidListItem } from '@drivewise/common-data';

export async function fetchBidList(): Promise<VehicleBidListItem[]> {
  return getMockBidList();
}
