import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { mountProfileApp, type ProfileAngularMount } from '@drivewise/profile-angular';

@Component({
  selector: 'app-profile-page-host',
  template: `
    <section class="profile-host" aria-label="Profile microfrontend host">
      <div #mountPoint></div>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .profile-host {
        min-height: 24rem;
      }
    `,
  ],
})
export class ProfilePageHostComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mountPoint', { static: true }) private mountPoint!: ElementRef<HTMLElement>;

  private readonly ngZone = inject(NgZone);
  private mounted?: ProfileAngularMount;
  private destroyed = false;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      void mountProfileApp(this.mountPoint.nativeElement).then((mounted) => {
        if (this.destroyed) {
          mounted.unmount();
          return;
        }

        this.mounted = mounted;
      });
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.ngZone.runOutsideAngular(() => {
      this.mounted?.unmount();
    });
  }
}
