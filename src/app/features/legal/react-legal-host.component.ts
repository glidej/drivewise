import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import {
  mountLegalDocument,
  type LegalDocument,
  type LegalDocumentId,
  type LegalDocumentPageProps,
  type LegalReactMount,
} from '@drivewise/legal-react';

@Component({
  selector: 'app-react-legal-host',
  template: '<div class="react-legal-host" #mountPoint></div>',
  styles: [
    `
      :host {
        display: block;
      }

      .react-legal-host {
        min-height: 24rem;
      }
    `,
  ],
})
export class ReactLegalHostComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) documentId!: LegalDocumentId;
  @Input() privacyDocument?: LegalDocument | null;

  @ViewChild('mountPoint', { static: true }) private mountPoint!: ElementRef<HTMLElement>;

  private readonly ngZone = inject(NgZone);
  private mounted?: LegalReactMount;

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.mounted = mountLegalDocument(this.mountPoint.nativeElement, this.currentProps());
    });
  }

  ngOnChanges(): void {
    if (!this.mounted) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      this.mounted?.update(this.currentProps());
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

  private currentProps(): LegalDocumentPageProps {
    return {
      documentId: this.documentId,
      privacyDocument: this.privacyDocument,
    };
  }
}
