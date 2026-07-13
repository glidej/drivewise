import { VehicleBidListItem } from '@drivewise/common-data';

import { useVehicleActivity } from '../../hooks/useVehicleActivity';
import { currencyFormatter, numberFormatter } from '../../utils/formatters';
import { BidSummary } from '../BidSummary';
import { LiveActivityPanel } from '../LiveActivityPanel';
import { VehicleFacts } from '../VehicleFacts';
import { VehicleTags } from '../VehicleTags';
import { Badge, Body, Card, DetailsButton, Media, MediaMeta, Title } from './BidVehicleCard.styles';

export interface BidVehicleCardProps {
  bid: VehicleBidListItem;
  onViewVehicle(vehicleId: string): void;
}

export function BidVehicleCard({ bid, onViewVehicle }: BidVehicleCardProps) {
  const { vehicle } = bid;
  const activity = useVehicleActivity(vehicle);

  return (
    <Card
      $highlighted={vehicle.highlighted}
      $marketSignal={activity.marketSignal}
      aria-label={`${vehicle.year} ${vehicle.make} ${vehicle.model} bid`}
    >
      <Media>
        <img src={vehicle.imageUrl} alt={vehicle.imageAlt} loading="lazy" />
        {vehicle.highlighted ? <Badge>Featured match</Badge> : null}
        <MediaMeta>
          {vehicle.bodyStyle} - {vehicle.drivetrain}
        </MediaMeta>
      </Media>

      <Body>
        <Title>
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
          <strong>{currencyFormatter.format(vehicle.price)}</strong>
        </Title>

        <VehicleFacts
          facts={[
            { label: 'Mileage', value: `${numberFormatter.format(vehicle.mileage)} mi` },
            { label: 'Fuel', value: vehicle.fuelType },
            { label: 'Location', value: `${vehicle.location.city}, ${vehicle.location.state}` },
            { label: 'Distance', value: `${vehicle.location.distanceMiles} mi away` },
          ]}
        />

        <BidSummary bid={bid} />
        <LiveActivityPanel activity={activity} />
        <VehicleTags tags={vehicle.tags} />

        <DetailsButton type="button" onClick={() => onViewVehicle(vehicle.id)}>
          View details
        </DetailsButton>
      </Body>
    </Card>
  );
}
