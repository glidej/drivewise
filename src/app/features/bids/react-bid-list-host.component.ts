import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { mountBidList, type BidListPageProps, type BidListReactMount } from '@drivewise/bids-react';

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
  private mounted?: BidListReactMount;

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
      detailHrefForVehicle: (vehicle) => `/buy/${encodeURIComponent(vehicle.id)}`,
    };
  }
}
