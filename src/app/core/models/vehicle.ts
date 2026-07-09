export type BodyStyle = 'SUV' | 'Sedan' | 'Truck' | 'Hatchback' | 'Coupe' | 'Wagon';

export type FuelType = 'Gasoline' | 'Hybrid' | 'Electric';

export interface DealerLocation {
  city: string;
  state: string;
  distanceMiles: number;
}

export interface VehicleHistory {
  owners: number;
  accidentFree: boolean;
  serviceRecords: number;
}

export interface Vehicle {
  id: string;
  vin: string;
  stockNumber: string;
  year: number;
  make: string;
  model: string;
  trim: string;
  price: number;
  mileage: number;
  bodyStyle: BodyStyle;
  drivetrain: string;
  fuelType: FuelType;
  transmission: string;
  exteriorColor: string;
  interiorColor: string;
  mpgCity: number | null;
  mpgHighway: number | null;
  rangeMiles?: number;
  imageUrl: string;
  imageAlt: string;
  location: DealerLocation;
  dealerName: string;
  rating: number;
  features: string[];
  tags: string[];
  history: VehicleHistory;
  sellerNotes: string;
  highlighted: boolean;
}

export interface InventoryFilters {
  query?: string;
  bodyStyle?: BodyStyle | 'Any';
  fuelType?: FuelType | 'Any';
  maxPrice?: number;
  maxMileage?: number;
  minYear?: number;
}
