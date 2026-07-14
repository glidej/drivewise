import { useState } from 'react';

import { useVehicleActivityStream } from '../../hooks/useVehicleActivityStream';
import { Vehicle } from '../../types';
import {
  ActivityFeed,
  ActivityFeedItem,
  ActivityToggle,
  LiveActivitySection,
  LiveHeader,
  LiveMetrics,
  MarketCallout,
  SocketDot,
} from './styles';

interface LiveActivityPanelProps {
  vehicle: Vehicle;
}

export function LiveActivityPanel({ vehicle }: LiveActivityPanelProps) {
  const activity = useVehicleActivityStream(vehicle);
  const [expanded, setExpanded] = useState(false);
  const activitySummary = activitySummaryForSignal(activity.marketSignal);

  return (
    <LiveActivitySection aria-label="Live dealer activity">
      <LiveHeader>
        <div>
          <p>Mock websocket</p>
          <h4>
            {activity.connection === 'reconnecting'
              ? 'Reconnecting to dealer activity'
              : activity.connection === 'connecting'
                ? 'Connecting to dealer activity'
                : 'Live dealer activity'}
          </h4>
        </div>
        <SocketDot $live={activity.connection === 'live'} />
      </LiveHeader>

      <MarketCallout $signal={activity.marketSignal}>
        {activity.marketSignal === 'price-drop'
          ? `${activitySummary}: ${formatCurrency(activity.priceDelta)} since opening.`
          : activity.marketSignal === 'high-demand'
            ? `${activitySummary} with ${formatNumber(activity.watchers)} active watchers.`
            : activity.marketSignal === 'reserved'
              ? `${activitySummary} changed the availability signal.`
              : `${activitySummary} from the mocked dealer feed.`}
      </MarketCallout>

      <LiveMetrics>
        <div>
          <dt>Watching</dt>
          <dd>{formatNumber(activity.watchers)}</dd>
        </div>
        <div>
          <dt>Saves today</dt>
          <dd>{formatNumber(activity.savesToday)}</dd>
        </div>
        <div>
          <dt>Price pulse</dt>
          <dd>{formatCurrency(activity.priceDelta)}</dd>
        </div>
      </LiveMetrics>

      <ActivityToggle type="button" onClick={() => setExpanded((current) => !current)}>
        {expanded ? 'Hide live feed' : 'Show live feed'}
      </ActivityToggle>

      {expanded ? (
        <ActivityFeed>
          {activity.recentEvents.length > 0 ? (
            activity.recentEvents.map((event) => (
              <ActivityFeedItem $kind={event.kind} key={event.id}>
                <span>{event.label}</span>
                <small>event {event.sequence}</small>
              </ActivityFeedItem>
            ))
          ) : (
            <li>Waiting for the first dealer event.</li>
          )}
        </ActivityFeed>
      ) : null}
    </LiveActivitySection>
  );
}

function activitySummaryForSignal(signal: string): string {
  switch (signal) {
    case 'price-drop':
      return 'Price movement detected';
    case 'high-demand':
      return 'High shopper demand';
    case 'reserved':
      return 'Appointment activity';
    default:
      return 'Steady listing activity';
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
