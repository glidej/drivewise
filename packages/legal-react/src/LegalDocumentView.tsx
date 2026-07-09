import { LegalDocument } from './types';

interface LegalDocumentViewProps {
  document: LegalDocument;
  dataSourceLabel: string;
}

export function LegalDocumentView({ document, dataSourceLabel }: LegalDocumentViewProps) {
  return (
    <article className="legal-react-page">
      <header className="legal-react-hero">
        <p className="legal-react-eyebrow">{document.eyebrow}</p>
        <h1>{document.title}</h1>
        <p>{document.summary}</p>

        <dl>
          <div>
            <dt>Effective date</dt>
            <dd>{formatDate(document.effectiveDate)}</dd>
          </div>
          <div>
            <dt>Last updated</dt>
            <dd>{formatDate(document.lastUpdated)}</dd>
          </div>
        </dl>

        <span className="legal-react-source">{dataSourceLabel}</span>
      </header>

      <aside className="legal-react-disclaimer" aria-label="Demo disclaimer">
        <strong>Placeholder content</strong>
        <p>
          This page is intentionally structured like a real legal document, but the body copy is
          lorem ipsum placeholder text for demonstration only.
        </p>
      </aside>

      <div className="legal-react-layout">
        <nav className="legal-react-section-nav" aria-label="Document sections">
          {document.sections.map((section) => (
            <a href={`#${sectionId(section.heading)}`} key={section.heading}>
              {section.heading}
            </a>
          ))}
        </nav>

        <div className="legal-react-section-list">
          {document.sections.map((section) => (
            <section className="legal-react-section" id={sectionId(section.heading)} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

export function LegalLoadingState({ label }: { label: string }) {
  return (
    <section className="legal-react-loading" aria-live="polite">
      <p className="legal-react-eyebrow">Loading</p>
      <h1>{label}</h1>
      <p>Preparing placeholder legal content for the demonstration app.</p>
    </section>
  );
}

export function LegalMissingState() {
  return (
    <section className="legal-react-missing">
      <p className="legal-react-eyebrow">Document not found</p>
      <h1>That legal page is not available.</h1>
      <p>Return home or use the footer links to open another placeholder document.</p>
    </section>
  );
}

function sectionId(heading: string): string {
  return heading.toLowerCase().replaceAll(' ', '-');
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeZone: 'UTC',
  }).format(new Date(value));
}
