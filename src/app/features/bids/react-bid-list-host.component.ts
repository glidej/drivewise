import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { mountBidList, type BidListPageProps, type BidsReactMount } from '@drivewise/bids-react';

@Component({
  selector: 'app-react-bid-list-host',
  template: '<div class="react-bid-list-host" #mountPoint></div>',
  styles: [
    `
      :host {
        display: block;
      }

      .react-bid-list-host {
        min-height: 24rem;
      }
    `,
  ],
})
export class ReactBidListHostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mountPoint', { static: true }) private mountPoint!: ElementRef<HTMLElement>;

  private readonly ngZone = inject(NgZone);
  private readonly router = inject(Router);
  private mounted?: BidsReactMount;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.mounted = mountBidList(this.mountPoint.nativeElement, this.currentProps());
    });
  }

  ngOnDestroy(): void {
    if (!this.mounted) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.mounted?.unmount();
    });
  }

  private currentProps(): BidListPageProps {
    return {
      onViewVehicle: (vehicleId) => {
        this.ngZone.run(() => {
          void this.router.navigate(['/buy', vehicleId]);
        });
      },
    };
  }
}
