import { DocumentPage, EmptyState, NoticeCard } from '@drivewise/react-ui';

import { AuthStatusPanel } from './AuthStatusPanel';
import { LegalDocument } from './types';

interface LegalDocumentViewProps {
  document: LegalDocument;
  dataSourceLabel: string;
}

export function LegalDocumentView({ document, dataSourceLabel }: LegalDocumentViewProps) {
  return (
    <DocumentPage
      eyebrow={document.eyebrow}
      title={document.title}
      summary={document.summary}
      metadata={[
        { label: 'Effective date', value: formatDate(document.effectiveDate) },
        { label: 'Last updated', value: formatDate(document.lastUpdated) },
      ]}
      sourceLabel={dataSourceLabel}
      notice={
        <NoticeCard title="Placeholder content">
          <p>
            This page is intentionally structured like a real legal document, but the body copy is
            lorem ipsum placeholder text for demonstration only.
          </p>
        </NoticeCard>
      }
      sections={document.sections}
    >
      <AuthStatusPanel />
    </DocumentPage>
  );
}

export function LegalLoadingState({ label }: { label: string }) {
  return (
    <EmptyState eyebrow="Loading" title={label}>
      <p>Preparing placeholder legal content for the demonstration app.</p>
    </EmptyState>
  );
}

export function LegalMissingState() {
  return (
    <EmptyState eyebrow="Document not found" title="That legal page is not available.">
      <p>Return home or use the footer links to open another placeholder document.</p>
    </EmptyState>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value));
}
