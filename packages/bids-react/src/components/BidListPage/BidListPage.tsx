import { EmptyState } from '@drivewise/react-ui';

import { useBidListQuery } from '../../hooks/useBidListQuery';
import { BidListPageProps } from '../../types';
import { BidVehicleCard } from '../BidVehicleCard';
import { CardList, Hero, Page, Panel, RetryButton } from './BidListPage.styles';

export function BidListPage({ onViewVehicle }: BidListPageProps) {
  const query = useBidListQuery();

  if (query.isLoading) {
    return (
      <EmptyState eyebrow="Bids" title="Loading active bids">
        <p>Checking the mock bid desk.</p>
      </EmptyState>
    );
  }

  if (query.isError) {
    return (
      <EmptyState eyebrow="Bids unavailable" title="We could not load active bids">
        <RetryButton type="button" onClick={() => query.refetch()}>
          Try again
        </RetryButton>
      </EmptyState>
    );
  }

  const bids = query.data ?? [];

  return (
    <Page>
      <Hero aria-labelledby="bids-title">
        <p>Bids</p>
        <h1 id="bids-title">Track active mock vehicle bids.</h1>
        <span>Review each active bid, dealer response, and live listing signal in one place.</span>
      </Hero>

      <Panel aria-live="polite">
        <header>
          <p>Bid list</p>
          <h2>{bids.length} active bids</h2>
        </header>

        {bids.length === 0 ? (
          <EmptyState eyebrow="Bid list" title="No active bids">
            <p>Place a mock bid from a vehicle detail page to see it tracked here.</p>
          </EmptyState>
        ) : (
          <CardList>
            {bids.map((bid) => (
              <BidVehicleCard bid={bid} key={bid.id} onViewVehicle={onViewVehicle} />
            ))}
          </CardList>
        )}
      </Panel>
    </Page>
  );
}
