import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import { InventoryService } from '../../core/services/inventory.service';

@Component({
  selector: 'app-home',
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly inventoryService = inject(InventoryService);

  protected readonly featuredVehicles = toSignal(this.inventoryService.getFeaturedVehicles(3), {
    initialValue: [],
  });

  protected readonly marketplaceStats = [
    { label: 'Mock vehicles', value: 126 },
    { label: 'Avg. response', value: '12 min' },
    { label: 'Demo dealers', value: 18 },
  ];
}
