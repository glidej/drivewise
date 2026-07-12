import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { mountBidList, type BidsReactMount } from '@drivewise/bids-react';

@Component({
  selector: 'app-react-bid-list-host',
  template: '<div class="react-bid-list-host" #mountPoint></div>',
  styles: [':host { display: block; } .react-bid-list-host { min-height: 24rem; }'],
})
export class ReactBidListHostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mountPoint', { static: true }) private mountPoint!: ElementRef<HTMLElement>;
  private readonly zone = inject(NgZone);
  private readonly router = inject(Router);
  private mounted?: BidsReactMount;

  ngAfterViewInit(): void {
    this.zone.runOutsideAngular(() => {
      this.mounted = mountBidList(this.mountPoint.nativeElement, {
        onViewVehicle: (vehicleId) => this.zone.run(() => void this.router.navigate(['/buy', vehicleId])),
      });
    });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => this.mounted?.unmount());
  }
}
