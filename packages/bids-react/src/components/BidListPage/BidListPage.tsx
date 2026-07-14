import { EmptyState } from '@drivewise/react-ui';

import { useBidListQuery } from '../../hooks/useBidListQuery';
import { fetchBidList } from '../../services/bid-list-service';
import { BidListPageProps, VehicleBidListItem } from '../../types';
import { VehicleBidCard } from '../VehicleBidCard';
import { BidCardList, BidsHeading, BidsHero, BidsPageShell, BidsPanel, Eyebrow } from './styles';

interface BidListPageInternalProps extends BidListPageProps {
  fetchBids?: typeof fetchBidList;
}

export function BidListPage({
  detailHrefForVehicle,
  fetchBids = fetchBidList,
}: BidListPageInternalProps) {
  const bidsQuery = useBidListQuery(fetchBids);

  if (bidsQuery.isLoading) {
    return (
      <EmptyState eyebrow="Loading" title="Preparing active bids.">
        <p>Checking the mock bid desk for active vehicle bids.</p>
      </EmptyState>
    );
  }

  if (bidsQuery.isError) {
    return (
      <EmptyState eyebrow="Bid list unavailable" title="We could not load active bids.">
        <p>Refresh this page or return to the vehicle list while the mock bid desk recovers.</p>
      </EmptyState>
    );
  }

  return (
    <BidsPageShell>
      <BidsHero aria-labelledby="bids-title">
        <div>
          <Eyebrow>Bids</Eyebrow>
          <h1 id="bids-title">Track active mock vehicle bids.</h1>
          <p>
            This React route package renders bid-specific vehicle cards while the Angular shell
            keeps routing and rollback control.
          </p>
        </div>
      </BidsHero>

      <BidsPanel aria-live="polite">
        <BidsHeading>
          <div>
            <Eyebrow>Bid list</Eyebrow>
            <h2>{bidsQuery.data?.length ?? 0} active bids</h2>
          </div>
        </BidsHeading>

        {bidsQuery.data && bidsQuery.data.length > 0 ? (
          <BidCardList>
            {bidsQuery.data.map((bid) => (
              <VehicleBidCard
                bid={bid}
                detailHref={detailHrefForVehicle(bid.vehicle)}
                key={bid.id}
                vehicle={bid.vehicle}
              />
            ))}
          </BidCardList>
        ) : (
          <BidListEmptyState />
        )}
      </BidsPanel>
    </BidsPageShell>
  );
}

function BidListEmptyState() {
  return (
    <EmptyState eyebrow="Bid list" title="No active bids">
      <p>Place a mock bid from a vehicle detail page to see it tracked here.</p>
    </EmptyState>
  );
}

export function countActiveBids(bids: readonly VehicleBidListItem[]): number {
  return bids.length;
}
