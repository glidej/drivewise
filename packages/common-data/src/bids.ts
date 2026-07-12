import type { VehicleBidListItem, VehicleBidRecord } from './bid.js';
import type { Vehicle } from './vehicle.js';

export function cloneVehicle(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    features: [...vehicle.features],
    tags: [...vehicle.tags],
    history: { ...vehicle.history },
    location: { ...vehicle.location },
  };
}

export function buildBidList(
  bidRecords: readonly VehicleBidRecord[],
  vehicles: readonly Vehicle[],
): VehicleBidListItem[] {
  const vehiclesById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));

  return bidRecords.flatMap((bid) => {
    const vehicle = vehiclesById.get(bid.vehicleId);
    return vehicle ? [{ ...bid, vehicle: cloneVehicle(vehicle) }] : [];
  });
}
