import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Vehicle } from '../../core/models/vehicle';

@Component({
  selector: 'app-vehicle-result-card',
  imports: [CurrencyPipe, DecimalPipe, RouterLink],
  templateUrl: './vehicle-result-card.component.html',
  styleUrl: './vehicle-result-card.component.css',
})
export class VehicleResultCardComponent {
  @Input({ required: true }) vehicle!: Vehicle;
}
