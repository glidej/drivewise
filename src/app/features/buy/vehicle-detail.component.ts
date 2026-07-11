import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { InventoryService } from '../../core/services/inventory.service';

@Component({
  selector: 'app-vehicle-detail',
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.scss',
})
export class VehicleDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly inventoryService = inject(InventoryService);

  protected readonly vehicle = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id') ?? ''),
      switchMap((id) => this.inventoryService.getVehicleById(id)),
    ),
    { initialValue: undefined },
  );
}
