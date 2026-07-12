import { buildBidList, MOCK_BID_RECORDS, MOCK_VEHICLES } from '@drivewise/common-data';
import { useQuery } from '@tanstack/react-query';

export const bidListQueryKey = ['bid-list'] as const;

export async function fetchBidList() {
  await Promise.resolve();
  return buildBidList(MOCK_BID_RECORDS, MOCK_VEHICLES);
}

export function useBidListQuery() {
  return useQuery({ queryKey: bidListQueryKey, queryFn: fetchBidList });
}
