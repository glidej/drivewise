import { useEffect, useState } from 'react';

import { Vehicle } from '../types';
import {
  buildInitialVehicleActivityState,
  nextVehicleActivityState,
  VehicleActivityState,
  withActivityConnection,
} from '../services/vehicle-activity-service';

export function useVehicleActivityStream(vehicle: Vehicle): VehicleActivityState {
  const [activity, setActivity] = useState(() => buildInitialVehicleActivityState(vehicle));

  useEffect(() => {
    let sequence = 0;
    setActivity(buildInitialVehicleActivityState(vehicle));

    const emitEvent = () => {
      setActivity((current) => nextVehicleActivityState(vehicle, current, sequence));
      sequence += 1;
    };

    const eventStart = window.setTimeout(emitEvent, 0);
    const eventInterval = window.setInterval(emitEvent, 1400);
    const liveTimer = window.setTimeout(() => {
      setActivity((current) => withActivityConnection(current, 'live'));
    }, 300);
    const reconnectingTimer = window.setTimeout(() => {
      setActivity((current) => withActivityConnection(current, 'reconnecting'));
    }, 2100);
    const restoredTimer = window.setTimeout(() => {
      setActivity((current) => withActivityConnection(current, 'live'));
    }, 2600);

    return () => {
      window.clearTimeout(eventStart);
      window.clearInterval(eventInterval);
      window.clearTimeout(liveTimer);
      window.clearTimeout(reconnectingTimer);
      window.clearTimeout(restoredTimer);
    };
  }, [vehicle]);

  return activity;
}
