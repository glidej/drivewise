import type { Vehicle } from './vehicle.js';

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
  connection: 'connecting', marketSignal: 'watching', watchers: 0, savesToday: 0,
  priceDelta: 0, recentEvents: [],
};

export function buildInitialVehicleActivityState(vehicle: Vehicle): VehicleActivityState {
  const seed = vehicleSeed(vehicle);
  const watchers = 8 + (seed % 17) + (vehicle.highlighted ? 8 : 0);
  return {
    connection: 'connecting',
    marketSignal: deriveMarketSignal(vehicle, watchers, 0, 0),
    watchers,
    savesToday: 2 + (seed % 6),
    priceDelta: 0,
    recentEvents: [{ id: `${vehicle.id}-socket-open`, kind: 'heartbeat', label: 'Opening mock dealer activity socket', sequence: 0, watcherDelta: 0, saveDelta: 0, priceDelta: 0 }],
  };
}

export function buildVehicleActivityEvent(vehicle: Vehicle, sequence: number): VehicleActivityEvent {
  const seed = vehicleSeed(vehicle);
  const cycle = (sequence + seed) % 5;
  const watcherDelta = cycle === 0 ? 2 + (seed % 4) : cycle === 3 ? -1 : 1;
  const saveDelta = cycle === 1 || cycle === 4 ? 1 : 0;
  const priceDelta = cycle === 2 ? -250 - (seed % 3) * 100 : 0;
  const kinds: VehicleActivityEventKind[] = ['watcher', 'save', 'price', 'hold', 'heartbeat'];
  const kind = kinds[cycle];
  const labels: Record<VehicleActivityEventKind, string> = {
    watcher: `${watcherDelta} shoppers joined this ${vehicle.bodyStyle} listing`,
    save: `${saveDelta} new saved search matched this ${vehicle.make}`,
    price: `Dealer price moved ${Math.abs(priceDelta).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}`,
    hold: 'Dealer appointment hold changed watcher mix',
    heartbeat: `Heartbeat received from ${vehicle.dealerName}`,
  };
  return { id: `${vehicle.id}-${sequence}-${kind}`, kind, label: labels[kind], sequence: sequence + 1, watcherDelta, saveDelta, priceDelta };
}

export function reduceVehicleActivityState(vehicle: Vehicle, state: VehicleActivityState, event: VehicleActivityEvent): VehicleActivityState {
  const watchers = Math.max(0, state.watchers + event.watcherDelta);
  const savesToday = Math.max(0, state.savesToday + event.saveDelta);
  const priceDelta = state.priceDelta + event.priceDelta;
  return { connection: state.connection, marketSignal: deriveMarketSignal(vehicle, watchers, priceDelta, event.priceDelta), watchers, savesToday, priceDelta, recentEvents: [event, ...state.recentEvents].slice(0, 4) };
}

function deriveMarketSignal(vehicle: Vehicle, watchers: number, priceDelta: number, latestPriceDelta: number): VehicleMarketSignal {
  if (latestPriceDelta <= -450 || priceDelta <= -900) return 'price-drop';
  if (!vehicle.history.accidentFree && watchers > 18) return 'reserved';
  if (vehicle.highlighted || watchers >= 25) return 'high-demand';
  return 'watching';
}

function vehicleSeed(vehicle: Vehicle): number {
  return Array.from(vehicle.id).reduce((sum, character) => sum + character.charCodeAt(0), 0);
}
