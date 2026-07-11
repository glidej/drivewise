import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs';

import { LegalDocumentId } from '../../core/models/legal';
import { LegalDocumentService } from '../../core/services/legal-document.service';

@Component({
  selector: 'app-legal-document',
  imports: [DatePipe, RouterLink],
  templateUrl: './legal-document.component.html',
  styleUrl: './legal-document.component.scss',
})
export class LegalDocumentComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly legalDocumentService = inject(LegalDocumentService);

  protected readonly document = toSignal(
    this.route.data.pipe(
      map((data) => data['documentId'] as LegalDocumentId),
      switchMap((documentId) => this.legalDocumentService.getDocument(documentId)),
    ),
    { initialValue: undefined },
  );
}
