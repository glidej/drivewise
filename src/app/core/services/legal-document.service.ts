import { Injectable } from '@angular/core';
import { defer, map, Observable, of } from 'rxjs';

import { MOCK_LEGAL_DOCUMENTS } from '../data/mock-legal';
import { LegalDocument, LegalDocumentId } from '../models/legal';

@Injectable({ providedIn: 'root' })
export class LegalDocumentService {
  getDocuments(): Observable<LegalDocument[]> {
    return defer(() => of(MOCK_LEGAL_DOCUMENTS.map((document) => this.cloneDocument(document))));
  }

  getDocument(id: LegalDocumentId): Observable<LegalDocument | undefined> {
    return this.getDocuments().pipe(
      map((documents) => documents.find((document) => document.id === id)),
    );
  }

  private cloneDocument(document: LegalDocument): LegalDocument {
    return {
      ...document,
      sections: document.sections.map((section) => ({
        ...section,
        body: [...section.body],
      })),
    };
  }
}
