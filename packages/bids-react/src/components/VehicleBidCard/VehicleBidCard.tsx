import { LiveActivityPanel } from '../LiveActivityPanel';
import { Vehicle, VehicleBidSummary } from '../../types';
import {
  BidGuidance,
  BidMetrics,
  BidSummarySection,
  BidSummaryHeader,
  DetailsLink,
  ResultBadge,
  ResultBody,
  ResultCard,
  ResultMedia,
  ResultMediaMeta,
  ResultTitle,
  TagRow,
  VehicleFacts,
} from './styles';

interface VehicleBidCardProps {
  bid: VehicleBidSummary;
  detailHref: string;
  vehicle: Vehicle;
}

export function VehicleBidCard({ bid, detailHref, vehicle }: VehicleBidCardProps) {
  return (
    <ResultCard $highlighted={vehicle.highlighted}>
      <ResultMedia>
        <img src={vehicle.imageUrl} alt={vehicle.imageAlt} loading="lazy" />
        {vehicle.highlighted ? <ResultBadge>Featured match</ResultBadge> : null}
        <ResultMediaMeta>
          {vehicle.bodyStyle} - {vehicle.drivetrain}
        </ResultMediaMeta>
      </ResultMedia>

      <ResultBody>
        <ResultTitle>
          <div>
            <p>
              {vehicle.year} {vehicle.make}
            </p>
            <h3>
              {vehicle.model} {vehicle.trim}
            </h3>
            <span>
              {vehicle.dealerName} - Rated {vehicle.rating}
            </span>
          </div>
          <strong>{formatCurrency(vehicle.price)}</strong>
        </ResultTitle>

        <VehicleFacts>
          <div>
            <dt>Mileage</dt>
            <dd>{formatNumber(vehicle.mileage)} mi</dd>
          </div>
          <div>
            <dt>Fuel</dt>
            <dd>{vehicle.fuelType}</dd>
          </div>
          <div>
            <dt>Location</dt>
            <dd>
              {vehicle.location.city}, {vehicle.location.state}
            </dd>
          </div>
          <div>
            <dt>Distance</dt>
            <dd>{vehicle.location.distanceMiles} mi away</dd>
          </div>
        </VehicleFacts>

        <BidSummarySection $status={bid.status} aria-label="Bid summary">
          <BidSummaryHeader>
            <div>
              <p>Bid desk</p>
              <h4>{bidHeadline(bid)}</h4>
            </div>
            <strong>{bidStatusLabel(bid.status)}</strong>
          </BidSummaryHeader>

          <BidMetrics>
            <div>
              <dt>Your bid</dt>
              <dd>{formatCurrency(bid.amount)}</dd>
            </div>
            <div>
              <dt>Max auto bid</dt>
              <dd>{formatCurrency(bid.maxAutoBid)}</dd>
            </div>
            <div>
              <dt>Bid rank</dt>
              <dd>
                #{bid.rank} of {bid.competingBids + 1}
              </dd>
            </div>
            <div>
              <dt>Expires</dt>
              <dd>{formatDateTime(bid.expiresAt)}</dd>
            </div>
          </BidMetrics>

          <BidGuidance $status={bid.status}>{bidGuidance(bid)}</BidGuidance>
        </BidSummarySection>

        <LiveActivityPanel vehicle={vehicle} />

        <TagRow>
          {vehicle.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </TagRow>

        <DetailsLink href={detailHref}>View details</DetailsLink>
      </ResultBody>
    </ResultCard>
  );
}

function bidHeadline(bid: VehicleBidSummary): string {
  switch (bid.status) {
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

function bidStatusLabel(status: VehicleBidSummary['status']): string {
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

function bidGuidance(bid: VehicleBidSummary): string {
  const bidBuffer = bid.maxAutoBid - bid.amount;

  switch (bid.status) {
    case 'outbid':
      return `Another shopper moved ahead. Increase by at least ${formatCurrency(bidBuffer + 250)} to challenge.`;
    case 'countered':
      return `Dealer counter: ${formatCurrency(bid.dealerCounterOffer ?? bid.amount)}. Accept or keep your current max bid.`;
    case 'winning':
      return `Your auto-bid buffer is ${formatCurrency(bidBuffer)} above the current bid.`;
    default:
      return `Bid placed ${formatDate(bid.placedAt)}. We are watching dealer updates.`;
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    currency: 'USD',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(value));
}
