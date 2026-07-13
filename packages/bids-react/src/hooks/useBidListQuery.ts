import { useQuery } from '@tanstack/react-query';

import { bidListQueryKey, fetchBidList } from '../services/bidListService';

export function useBidListQuery() {
  return useQuery({
    queryKey: bidListQueryKey,
    queryFn: fetchBidList,
  });
}
