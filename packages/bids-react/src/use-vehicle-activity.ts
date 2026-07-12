import { buildInitialVehicleActivityState, buildVehicleActivityEvent, reduceVehicleActivityState, type Vehicle, type VehicleActivityConnection } from '@drivewise/common-data';
import { useEffect, useState } from 'react';

export function useVehicleActivity(vehicle: Vehicle) {
  const [state, setState] = useState(() => buildInitialVehicleActivityState(vehicle));

  useEffect(() => {
    setState(buildInitialVehicleActivityState(vehicle));
    let sequence = 0;
    const eventTimer = window.setInterval(() => {
      const event = buildVehicleActivityEvent(vehicle, sequence++);
      setState((current) => reduceVehicleActivityState(vehicle, current, event));
    }, 1400);
    const timers = [
      window.setTimeout(() => setConnection('live'), 300),
      window.setTimeout(() => setConnection('reconnecting'), 2100),
      window.setTimeout(() => setConnection('live'), 2600),
    ];
    function setConnection(connection: VehicleActivityConnection) {
      setState((current) => ({ ...current, connection }));
    }
    return () => { window.clearInterval(eventTimer); timers.forEach(window.clearTimeout); };
  }, [vehicle]);

  return state;
}
