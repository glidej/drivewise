import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface DocumentPageMetaItem {
  label: string;
  value: ReactNode;
}

export interface DocumentPageSection {
  heading: string;
  body: readonly string[];
  id?: string;
}

export interface DocumentPageProps {
  eyebrow: string;
  title: string;
  summary: string;
  metadata?: readonly DocumentPageMetaItem[];
  sourceLabel?: ReactNode;
  notice?: ReactNode;
  sectionNavLabel?: string;
  sections: readonly DocumentPageSection[];
  children?: ReactNode;
}

export function DocumentPage({
  eyebrow,
  title,
  summary,
  metadata = [],
  sourceLabel,
  notice,
  sectionNavLabel = 'Document sections',
  sections,
  children,
}: DocumentPageProps) {
  const sectionsWithIds = sections.map((section) => ({
    ...section,
    id: section.id ?? sectionId(section.heading),
  }));

  return (
    <article className="dw-react-ui-document-page">
      <header className="dw-react-ui-hero">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{summary}</p>

        {metadata.length > 0 ? (
          <dl>
            {metadata.map((item) => (
              <div key={item.label}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {sourceLabel ? <span className="dw-react-ui-source">{sourceLabel}</span> : null}
      </header>

      {notice}
      {children}

      <div className="dw-react-ui-document-layout">
        <nav className="dw-react-ui-section-nav" aria-label={sectionNavLabel}>
          {sectionsWithIds.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.heading}
            </a>
          ))}
        </nav>

        <div className="dw-react-ui-section-list">
          {sectionsWithIds.map((section) => (
            <section className="dw-react-ui-section" id={section.id} key={section.id}>
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

export interface NoticeCardProps {
  title: string;
  children: ReactNode;
}

export function NoticeCard({ title, children }: NoticeCardProps) {
  return (
    <aside className="dw-react-ui-notice" aria-label={title}>
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  );
}

export interface StatusPanelProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  ariaLabel?: string;
}

export function StatusPanel({ eyebrow, title, children, actions, ariaLabel }: StatusPanelProps) {
  return (
    <aside className="dw-react-ui-status-panel" aria-label={ariaLabel}>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        <div className="dw-react-ui-status-panel-body">{children}</div>
      </div>
      {actions ? <div className="dw-react-ui-status-panel-actions">{actions}</div> : null}
    </aside>
  );
}

export interface EmptyStateProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export function EmptyState({ eyebrow, title, children }: EmptyStateProps) {
  return (
    <section className="dw-react-ui-state" aria-live="polite">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <div>{children}</div>
    </section>
  );
}

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PrimaryButton({ children, className, ...props }: PrimaryButtonProps) {
  const buttonClassName = ['dw-react-ui-button', className].filter(Boolean).join(' ');

  return (
    <button {...props} className={buttonClassName}>
      {children}
    </button>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="dw-react-ui-eyebrow">{children}</p>;
}

export function sectionId(heading: string): string {
  return (
    heading
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'section'
  );
}
