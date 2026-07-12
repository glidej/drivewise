import { Injectable } from '@angular/core';
import { Observable, combineLatest, concat, defer, of, timer } from 'rxjs';
import { map, scan, shareReplay, startWith } from 'rxjs/operators';
import {
  buildInitialVehicleActivityState,
  buildVehicleActivityEvent,
  EMPTY_VEHICLE_ACTIVITY_STATE,
  reduceVehicleActivityState,
  Vehicle,
  VehicleActivityConnection,
  VehicleActivityState,
} from '@drivewise/common-data';

export { buildInitialVehicleActivityState, EMPTY_VEHICLE_ACTIVITY_STATE } from '@drivewise/common-data';
export type { VehicleActivityState } from '@drivewise/common-data';

@Injectable({ providedIn: 'root' })
export class VehicleActivityStreamService {
  connect(vehicle: Vehicle): Observable<VehicleActivityState> {
    return defer(() => {
      const initialState = buildInitialVehicleActivityState(vehicle);
      const connection$ = concat(
        of<VehicleActivityConnection>('connecting'),
        timer(300).pipe(map(() => 'live' as const)),
        timer(1800).pipe(map(() => 'reconnecting' as const)),
        timer(500).pipe(map(() => 'live' as const)),
      );
      const socketEvents$ = timer(0, 1400).pipe(
        map((sequence) => buildVehicleActivityEvent(vehicle, sequence)),
        scan(
          (state, event) => reduceVehicleActivityState(vehicle, state, event),
          initialState,
        ),
        startWith(initialState),
      );

      return combineLatest([connection$, socketEvents$]).pipe(
        map(([connection, state]) => ({ ...state, connection })),
        startWith(initialState),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    });
  }
}
