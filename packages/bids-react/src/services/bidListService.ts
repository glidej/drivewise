import {
  buildBidList,
  MOCK_BID_RECORDS,
  MOCK_VEHICLES,
  VehicleBidListItem,
} from '@drivewise/common-data';

export const bidListQueryKey = ['bid-list'] as const;

type FetchBidList = () => Promise<VehicleBidListItem[]>;

let fetchBidListImpl: FetchBidList = defaultFetchBidList;

export function fetchBidList(): Promise<VehicleBidListItem[]> {
  return fetchBidListImpl();
}

export function setFetchBidListForTest(fetcher: FetchBidList): () => void {
  fetchBidListImpl = fetcher;

  return () => {
    fetchBidListImpl = defaultFetchBidList;
  };
}

async function defaultFetchBidList(): Promise<VehicleBidListItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 0));

  return buildBidList(MOCK_BID_RECORDS, MOCK_VEHICLES);
}
