import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { LegalDocumentService } from './legal-document.service';

describe('LegalDocumentService', () => {
  let service: LegalDocumentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegalDocumentService);
  });

  it('returns the terms and privacy documents', async () => {
    const documents = await firstValueFrom(service.getDocuments());

    expect(documents.map((document) => document.id)).toEqual(['terms', 'privacy']);
  });

  it('returns defensive copies of legal sections', async () => {
    const firstResult = await firstValueFrom(service.getDocument('terms'));
    firstResult?.sections[0].body.push('Unexpected legal copy');

    const secondResult = await firstValueFrom(service.getDocument('terms'));

    expect(secondResult?.sections[0].body).not.toContain('Unexpected legal copy');
  });

  it('finds the privacy document by id', async () => {
    const document = await firstValueFrom(service.getDocument('privacy'));

    expect(document?.title).toBe('Privacy Policy');
    expect(document?.sections[0].heading).toBe('Information We Collect');
  });
});
