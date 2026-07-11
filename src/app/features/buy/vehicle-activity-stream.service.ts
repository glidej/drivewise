import { Injectable } from '@angular/core';
import { Observable, combineLatest, concat, defer, of, timer } from 'rxjs';
import { map, scan, shareReplay, startWith } from 'rxjs/operators';

import { Vehicle } from '../../core/models/vehicle';

export type VehicleActivityConnection = 'connecting' | 'live' | 'reconnecting';
export type VehicleMarketSignal = 'watching' | 'high-demand' | 'price-drop' | 'reserved';
export type VehicleActivityEventKind = 'heartbeat' | 'watcher' | 'save' | 'price' | 'hold';

export interface VehicleActivityEvent {
  id: string;
  kind: VehicleActivityEventKind;
  label: string;
  sequence: number;
  watcherDelta: number;
  saveDelta: number;
  priceDelta: number;
}

export interface VehicleActivityState {
  connection: VehicleActivityConnection;
  marketSignal: VehicleMarketSignal;
  watchers: number;
  savesToday: number;
  priceDelta: number;
  recentEvents: readonly VehicleActivityEvent[];
}

export const EMPTY_VEHICLE_ACTIVITY_STATE: VehicleActivityState = {
  connection: 'connecting',
  marketSignal: 'watching',
  watchers: 0,
  savesToday: 0,
  priceDelta: 0,
  recentEvents: [],
};

@Injectable({ providedIn: 'root' })
export class VehicleActivityStreamService {
  connect(vehicle: Vehicle): Observable<VehicleActivityState> {
    return defer(() => {
      const seed = vehicleSeed(vehicle);
      const initialState = buildInitialVehicleActivityState(vehicle);
      const connection$ = concat(
        of<VehicleActivityConnection>('connecting'),
        timer(300).pipe(map(() => 'live' as const)),
        timer(1800).pipe(map(() => 'reconnecting' as const)),
        timer(500).pipe(map(() => 'live' as const)),
      );
      const socketEvents$ = timer(0, 1400).pipe(
        map((sequence) => buildSocketEvent(vehicle, seed, sequence)),
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

export function buildInitialVehicleActivityState(vehicle: Vehicle): VehicleActivityState {
  const seed = vehicleSeed(vehicle);
  const watchers = 8 + (seed % 17) + (vehicle.highlighted ? 8 : 0);
  const savesToday = 2 + (seed % 6);

  return {
    connection: 'connecting',
    marketSignal: deriveMarketSignal(vehicle, watchers, 0, 0),
    watchers,
    savesToday,
    priceDelta: 0,
    recentEvents: [
      {
        id: `${vehicle.id}-socket-open`,
        kind: 'heartbeat',
        label: 'Opening mock dealer activity socket',
        sequence: 0,
        watcherDelta: 0,
        saveDelta: 0,
        priceDelta: 0,
      },
    ],
  };
}

function reduceVehicleActivityState(
  vehicle: Vehicle,
  state: VehicleActivityState,
  event: VehicleActivityEvent,
): VehicleActivityState {
  const watchers = Math.max(0, state.watchers + event.watcherDelta);
  const savesToday = Math.max(0, state.savesToday + event.saveDelta);
  const priceDelta = state.priceDelta + event.priceDelta;

  return {
    connection: state.connection,
    marketSignal: deriveMarketSignal(vehicle, watchers, priceDelta, event.priceDelta),
    watchers,
    savesToday,
    priceDelta,
    recentEvents: [event, ...state.recentEvents].slice(0, 4),
  };
}

function deriveMarketSignal(
  vehicle: Vehicle,
  watchers: number,
  priceDelta: number,
  latestPriceDelta: number,
): VehicleMarketSignal {
  if (latestPriceDelta <= -450 || priceDelta <= -900) {
    return 'price-drop';
  }

  if (!vehicle.history.accidentFree && watchers > 18) {
    return 'reserved';
  }

  if (vehicle.highlighted || watchers >= 25) {
    return 'high-demand';
  }

  return 'watching';
}

function buildSocketEvent(vehicle: Vehicle, seed: number, sequence: number): VehicleActivityEvent {
  const cycle = (sequence + seed) % 5;
  const watcherDelta = cycle === 0 ? 2 + (seed % 4) : cycle === 3 ? -1 : 1;
  const saveDelta = cycle === 1 || cycle === 4 ? 1 : 0;
  const priceDelta = cycle === 2 ? -250 - (seed % 3) * 100 : 0;
  const kind = eventKindForCycle(cycle);

  return {
    id: `${vehicle.id}-${sequence}-${kind}`,
    kind,
    label: eventLabel(vehicle, kind, watcherDelta, saveDelta, priceDelta),
    sequence: sequence + 1,
    watcherDelta,
    saveDelta,
    priceDelta,
  };
}

function eventKindForCycle(cycle: number): VehicleActivityEventKind {
  switch (cycle) {
    case 0:
      return 'watcher';
    case 1:
      return 'save';
    case 2:
      return 'price';
    case 3:
      return 'hold';
    default:
      return 'heartbeat';
  }
}

function eventLabel(
  vehicle: Vehicle,
  kind: VehicleActivityEventKind,
  watcherDelta: number,
  saveDelta: number,
  priceDelta: number,
): string {
  switch (kind) {
    case 'watcher':
      return `${watcherDelta} shoppers joined this ${vehicle.bodyStyle} listing`;
    case 'save':
      return `${saveDelta} new saved search matched this ${vehicle.make}`;
    case 'price':
      return `Dealer price moved ${Math.abs(priceDelta).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      })}`;
    case 'hold':
      return 'Dealer appointment hold changed watcher mix';
    default:
      return `Heartbeat received from ${vehicle.dealerName}`;
  }
}

function vehicleSeed(vehicle: Vehicle): number {
  return Array.from(vehicle.id).reduce((sum, character) => sum + character.charCodeAt(0), 0);
}
