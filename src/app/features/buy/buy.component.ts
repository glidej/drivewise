import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { BodyStyle, FuelType, InventoryFilters, Vehicle } from '../../core/models/vehicle';
import { InventoryService } from '../../core/services/inventory.service';
import { VehicleResultCardComponent } from './vehicle-result-card.component';

interface BuyFormFilters {
  query: string;
  bodyStyle: BodyStyle | 'Any';
  fuelType: FuelType | 'Any';
  maxPrice: number;
  maxMileage: number;
  minYear: number;
}

@Component({
  selector: 'app-buy',
  imports: [FormsModule, VehicleResultCardComponent],
  templateUrl: './buy.component.html',
  styleUrl: './buy.component.scss',
})
export class BuyComponent {
  private readonly inventoryService = inject(InventoryService);

  protected readonly bodyStyles: Array<BodyStyle | 'Any'> = [
    'Any',
    'SUV',
    'Sedan',
    'Truck',
    'Hatchback',
    'Coupe',
    'Wagon',
  ];
  protected readonly fuelTypes: Array<FuelType | 'Any'> = ['Any', 'Gasoline', 'Hybrid', 'Electric'];
  protected readonly vehicles = signal<Vehicle[]>([]);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected filters: BuyFormFilters = this.defaultFilters();

  constructor() {
    this.runSearch();
  }

  protected runSearch(): void {
    this.loading.set(true);
    this.error.set(null);

    this.inventoryService
      .searchVehicles(this.toInventoryFilters())
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (vehicles) => this.vehicles.set(vehicles),
        error: () => this.error.set('Inventory could not be loaded. Try again in a moment.'),
      });
  }

  protected resetFilters(): void {
    this.filters = this.defaultFilters();
    this.runSearch();
  }

  protected trackVehicle(_index: number, vehicle: Vehicle): string {
    return vehicle.id;
  }

  private defaultFilters(): BuyFormFilters {
    return {
      query: '',
      bodyStyle: 'Any',
      fuelType: 'Any',
      maxPrice: 50000,
      maxMileage: 60000,
      minYear: 2021,
    };
  }

  private toInventoryFilters(): InventoryFilters {
    return {
      query: this.filters.query,
      bodyStyle: this.filters.bodyStyle,
      fuelType: this.filters.fuelType,
      maxPrice: this.filters.maxPrice,
      maxMileage: this.filters.maxMileage,
      minYear: this.filters.minYear,
    };
  }
}
