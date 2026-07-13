import { VehicleActivityState } from '@drivewise/common-data';
import { useState } from 'react';

import { currencyFormatter, numberFormatter } from '../../utils/formatters';
import { VehicleFacts } from '../VehicleFacts';
import { Activity, Callout, Dot, Feed, Header, Toggle } from './LiveActivityPanel.styles';

export interface LiveActivityPanelProps {
  activity: VehicleActivityState;
}

export function LiveActivityPanel({ activity }: LiveActivityPanelProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Activity aria-label="Live dealer activity">
      <Header>
        <div>
          <p>Mock websocket</p>
          <h4>{activityConnectionLabel(activity.connection)}</h4>
        </div>
        <Dot $live={activity.connection === 'live'} />
      </Header>

      <Callout>{activityCallout(activity)}</Callout>

      <VehicleFacts
        facts={[
          { label: 'Watching', value: numberFormatter.format(activity.watchers) },
          { label: 'Saves today', value: numberFormatter.format(activity.savesToday) },
          { label: 'Price pulse', value: currencyFormatter.format(activity.priceDelta) },
        ]}
      />

      <Toggle aria-expanded={expanded} type="button" onClick={() => setExpanded((value) => !value)}>
        {expanded ? 'Hide live feed' : 'Show live feed'}
      </Toggle>

      {expanded ? (
        <Feed>
          {activity.recentEvents.length > 0 ? (
            activity.recentEvents.map((event) => (
              <li key={event.id}>
                <strong>{event.label}</strong>
                <small>event {event.sequence}</small>
              </li>
            ))
          ) : (
            <li>Waiting for the first dealer event.</li>
          )}
        </Feed>
      ) : null}
    </Activity>
  );
}

function activityConnectionLabel(connection: VehicleActivityState['connection']): string {
  if (connection === 'connecting') {
    return 'Connecting to dealer activity';
  }

  if (connection === 'reconnecting') {
    return 'Reconnecting to dealer activity';
  }

  return 'Live dealer activity';
}

function activityCallout(activity: VehicleActivityState): string {
  if (activity.marketSignal === 'price-drop') {
    return `Price movement detected: ${currencyFormatter.format(activity.priceDelta)} since opening.`;
  }

  if (activity.marketSignal === 'high-demand') {
    return `High shopper demand with ${numberFormatter.format(activity.watchers)} active watchers.`;
  }

  if (activity.marketSignal === 'reserved') {
    return 'Appointment activity changed the availability signal.';
  }

  return 'Steady listing activity from the mocked dealer feed.';
}
