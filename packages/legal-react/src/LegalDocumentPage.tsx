import { useQuery } from '@tanstack/react-query';

import { LegalDocumentView, LegalLoadingState, LegalMissingState } from './LegalDocumentView';
import { fetchTermsDocument } from './mock-terms';
import { LegalDocumentPageProps } from './types';

export function LegalDocumentPage({ documentId, privacyDocument }: LegalDocumentPageProps) {
  const termsQuery = useQuery({
    enabled: documentId === 'terms',
    queryKey: ['legal-document', 'terms'],
    queryFn: fetchTermsDocument,
  });

  if (documentId === 'terms') {
    if (termsQuery.isLoading) {
      return <LegalLoadingState label="Terms of Service" />;
    }

    if (!termsQuery.data) {
      return <LegalMissingState />;
    }

    return (
      <LegalDocumentView
        document={termsQuery.data}
        dataSourceLabel="Terms data fetched inside legal-react with React Query."
      />
    );
  }

  if (documentId === 'privacy') {
    if (privacyDocument === undefined) {
      return <LegalLoadingState label="Privacy Policy" />;
    }

    if (!privacyDocument) {
      return <LegalMissingState />;
    }

    return (
      <LegalDocumentView
        document={privacyDocument}
        dataSourceLabel="Privacy data supplied by Angular through microfrontend props."
      />
    );
  }

  return <LegalMissingState />;
}
