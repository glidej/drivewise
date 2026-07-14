import { useQuery } from '@tanstack/react-query';

import { fetchBidList } from '../services/bid-list-service';

export const bidListQueryKey = ['bid-list'] as const;

export function useBidListQuery(fetcher = fetchBidList) {
  return useQuery({
    queryKey: bidListQueryKey,
    queryFn: fetcher,
  });
}
