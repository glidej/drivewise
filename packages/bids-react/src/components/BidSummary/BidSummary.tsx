import { VehicleBidListItem, VehicleBidStatus } from '@drivewise/common-data';

import {
  bidExpirationFormatter,
  bidPlacedFormatter,
  currencyFormatter,
} from '../../utils/formatters';
import { VehicleFacts } from '../VehicleFacts';
import { Guidance, Header, StatusPill, Summary } from './BidSummary.styles';

export interface BidSummaryProps {
  bid: VehicleBidListItem;
}

export function BidSummary({ bid }: BidSummaryProps) {
  const buffer = bid.maxAutoBid - bid.amount;

  return (
    <Summary $status={bid.status} aria-label="Bid summary">
      <Header>
        <div>
          <p>Bid desk</p>
          <h4>{bidHeadline(bid.status)}</h4>
        </div>
        <StatusPill>{bidStatusLabel(bid.status)}</StatusPill>
      </Header>

      <VehicleFacts
        facts={[
          { label: 'Your bid', value: currencyFormatter.format(bid.amount) },
          { label: 'Max auto bid', value: currencyFormatter.format(bid.maxAutoBid) },
          { label: 'Bid rank', value: `#${bid.rank} of ${bid.competingBids + 1}` },
          { label: 'Expires', value: bidExpirationFormatter.format(new Date(bid.expiresAt)) },
        ]}
      />

      <Guidance $urgent={bid.status === 'outbid' || bid.status === 'countered'}>
        {bidGuidance(bid, buffer)}
      </Guidance>
    </Summary>
  );
}

export function bidStatusLabel(status: VehicleBidStatus): string {
  switch (status) {
    case 'winning':
      return 'Winning bid';
    case 'outbid':
      return 'Outbid';
    case 'countered':
      return 'Dealer countered';
    default:
      return 'Watching auction';
  }
}

function bidHeadline(status: VehicleBidStatus): string {
  switch (status) {
    case 'winning':
      return 'You are leading this bid';
    case 'outbid':
      return 'Your bid needs attention';
    case 'countered':
      return 'Dealer sent a counteroffer';
    default:
      return 'You are watching this bid';
  }
}

function bidGuidance(bid: VehicleBidListItem, buffer: number): string {
  if (bid.status === 'outbid') {
    return `Another shopper moved ahead. Increase by at least ${currencyFormatter.format(buffer + 250)} to challenge.`;
  }

  if (bid.status === 'countered') {
    return `Dealer counter: ${currencyFormatter.format(bid.dealerCounterOffer ?? bid.amount)}. Accept or keep your current max bid.`;
  }

  if (bid.status === 'winning') {
    return `Your auto-bid buffer is ${currencyFormatter.format(buffer)} above the current bid.`;
  }

  return `Bid placed ${bidPlacedFormatter.format(new Date(bid.placedAt))}. We are watching dealer updates.`;
}
