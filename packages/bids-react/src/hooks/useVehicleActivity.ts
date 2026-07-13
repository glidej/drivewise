import {
  buildInitialVehicleActivityState,
  buildVehicleActivityEvent,
  reduceVehicleActivityState,
  type Vehicle,
} from '@drivewise/common-data';
import { useEffect, useState } from 'react';

export function useVehicleActivity(vehicle: Vehicle) {
  const [state, setState] = useState(() => buildInitialVehicleActivityState(vehicle));

  useEffect(() => {
    setState(buildInitialVehicleActivityState(vehicle));

    const liveTimer = window.setTimeout(() => {
      setState((current) => ({ ...current, connection: 'live' }));
    }, 300);
    const reconnectTimer = window.setTimeout(() => {
      setState((current) => ({ ...current, connection: 'reconnecting' }));
    }, 1800);
    const reliveTimer = window.setTimeout(() => {
      setState((current) => ({ ...current, connection: 'live' }));
    }, 2300);
    let sequence = 0;
    const eventTimer = window.setInterval(() => {
      const event = buildVehicleActivityEvent(vehicle, sequence);
      sequence += 1;
      setState((current) => reduceVehicleActivityState(vehicle, current, event));
    }, 1400);

    return () => {
      window.clearTimeout(liveTimer);
      window.clearTimeout(reconnectTimer);
      window.clearTimeout(reliveTimer);
      window.clearInterval(eventTimer);
    };
  }, [vehicle]);

  return state;
}
