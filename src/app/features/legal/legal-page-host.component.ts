import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { type LegalDocument as ReactLegalDocument, type LegalDocumentId } from '@drivewise/legal-react';
import { map, of, startWith, switchMap } from 'rxjs';

import { LegalDocument } from '../../core/models/legal';
import { FeatureFlagsService } from '../../core/services/feature-flags.service';
import { LegalDocumentService } from '../../core/services/legal-document.service';
import { LegalDocumentComponent } from './legal-document.component';
import { ReactLegalHostComponent } from './react-legal-host.component';

@Component({
  selector: 'app-legal-page-host',
  imports: [LegalDocumentComponent, ReactLegalHostComponent],
  templateUrl: './legal-page-host.component.html',
})
export class LegalPageHostComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly featureFlags = inject(FeatureFlagsService);
  private readonly legalDocumentService = inject(LegalDocumentService);

  protected readonly legalReactEnabled = this.featureFlags.legalReactEnabled;
  protected readonly documentId = toSignal(
    this.route.data.pipe(map((data) => this.coerceDocumentId(data['documentId']))),
    { initialValue: 'terms' as LegalDocumentId },
  );
  protected readonly privacyDocument = toSignal(
    this.route.data.pipe(
      map((data) => this.coerceDocumentId(data['documentId'])),
      switchMap((documentId) => {
        if (documentId !== 'privacy') {
          return of(null);
        }

        return this.legalDocumentService
          .getDocument('privacy')
          .pipe(map((document) => (document ? this.toReactDocument(document) : null)));
      }),
      startWith(undefined as ReactLegalDocument | null | undefined),
    ),
    { initialValue: undefined as ReactLegalDocument | null | undefined },
  );

  private coerceDocumentId(value: unknown): LegalDocumentId {
    return value === 'privacy' ? 'privacy' : 'terms';
  }

  private toReactDocument(document: LegalDocument): ReactLegalDocument {
    return {
      id: document.id,
      title: document.title,
      eyebrow: document.eyebrow,
      summary: document.summary,
      effectiveDate: document.effectiveDate,
      lastUpdated: document.lastUpdated,
      sections: document.sections.map((section) => ({
        heading: section.heading,
        body: [...section.body],
      })),
    };
  }
}
