export type LegalDocumentId = 'terms' | 'privacy';

export interface LegalDocumentSection {
  heading: string;
  body: string[];
}

export interface LegalDocument {
  id: LegalDocumentId;
  title: string;
  eyebrow: string;
  summary: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: LegalDocumentSection[];
}

export interface LegalDocumentPageProps {
  documentId: LegalDocumentId;
  privacyDocument?: LegalDocument | null;
}

export interface LegalReactMount {
  update(props: LegalDocumentPageProps): void;
  unmount(): void;
}
