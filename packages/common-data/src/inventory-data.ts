import { MOCK_BID_RECORDS } from './bid-data';
import { VehicleBidListItem, VehicleBidRecord } from './bid-types';
import { MOCK_VEHICLES } from './vehicle-data';
import { InventoryFilters, Vehicle } from './vehicle-types';

export function cloneVehicle(vehicle: Vehicle): Vehicle {
  return {
    ...vehicle,
    features: [...vehicle.features],
    tags: [...vehicle.tags],
    history: { ...vehicle.history },
    location: { ...vehicle.location },
  };
}

export function getMockVehicles(): Vehicle[] {
  return MOCK_VEHICLES.map((vehicle) => cloneVehicle(vehicle));
}

export function getFeaturedMockVehicles(limit = 3): Vehicle[] {
  return getMockVehicles()
    .filter((vehicle) => vehicle.highlighted)
    .slice(0, limit);
}

export function getMockVehicleById(id: string): Vehicle | undefined {
  const vehicle = MOCK_VEHICLES.find((candidate) => candidate.id === id);

  return vehicle ? cloneVehicle(vehicle) : undefined;
}

export function searchMockVehicles(filters: InventoryFilters = {}): Vehicle[] {
  return getMockVehicles().filter((vehicle) => {
    const matchesQuery = matchesVehicleQuery(vehicle, filters.query);
    const matchesBody =
      !filters.bodyStyle || filters.bodyStyle === 'Any' || vehicle.bodyStyle === filters.bodyStyle;
    const matchesFuel =
      !filters.fuelType || filters.fuelType === 'Any' || vehicle.fuelType === filters.fuelType;
    const matchesPrice = !filters.maxPrice || vehicle.price <= filters.maxPrice;
    const matchesMileage = !filters.maxMileage || vehicle.mileage <= filters.maxMileage;
    const matchesYear = !filters.minYear || vehicle.year >= filters.minYear;

    return (
      matchesQuery && matchesBody && matchesFuel && matchesPrice && matchesMileage && matchesYear
    );
  });
}

export function getMockBidList(
  bidRecords: readonly VehicleBidRecord[] = MOCK_BID_RECORDS,
  vehicles: readonly Vehicle[] = MOCK_VEHICLES,
): VehicleBidListItem[] {
  const vehiclesById = new Map(vehicles.map((vehicle) => [vehicle.id, vehicle]));

  return bidRecords.flatMap((bid) => {
    const vehicle = vehiclesById.get(bid.vehicleId);

    return vehicle ? [{ ...bid, vehicle: cloneVehicle(vehicle) }] : [];
  });
}

function matchesVehicleQuery(vehicle: Vehicle, query = ''): boolean {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [
    vehicle.year,
    vehicle.make,
    vehicle.model,
    vehicle.trim,
    vehicle.bodyStyle,
    vehicle.fuelType,
    vehicle.tags.join(' '),
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}
