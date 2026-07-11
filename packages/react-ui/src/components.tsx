import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';

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
    <DocumentPageShell>
      <Hero>
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

        {sourceLabel ? <SourceLabel>{sourceLabel}</SourceLabel> : null}
      </Hero>

      {notice}
      {children}

      <DocumentLayout>
        <SectionNav aria-label={sectionNavLabel}>
          {sectionsWithIds.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.heading}
            </a>
          ))}
        </SectionNav>

        <SectionList>
          {sectionsWithIds.map((section) => (
            <DocumentSection id={section.id} key={section.id}>
              <h2>{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </DocumentSection>
          ))}
        </SectionList>
      </DocumentLayout>
    </DocumentPageShell>
  );
}

export interface NoticeCardProps {
  title: string;
  children: ReactNode;
}

export function NoticeCard({ title, children }: NoticeCardProps) {
  return (
    <NoticeAside aria-label={title}>
      <strong>{title}</strong>
      <div>{children}</div>
    </NoticeAside>
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
    <StatusAside aria-label={ariaLabel}>
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        <StatusPanelBody>{children}</StatusPanelBody>
      </div>
      {actions ? <StatusPanelActions>{actions}</StatusPanelActions> : null}
    </StatusAside>
  );
}

export interface EmptyStateProps {
  eyebrow: string;
  title: string;
  children: ReactNode;
}

export function EmptyState({ eyebrow, title, children }: EmptyStateProps) {
  return (
    <StateSection aria-live="polite">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1>{title}</h1>
      <div>{children}</div>
    </StateSection>
  );
}

export interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PrimaryButton({ children, ...props }: PrimaryButtonProps) {
  return <StyledPrimaryButton {...props}>{children}</StyledPrimaryButton>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <EyebrowText>{children}</EyebrowText>;
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

const colors = {
  accent: '#0f766e',
  accentSoft: '#e6f4f1',
  ink: '#14213d',
  line: '#d9e2ec',
  muted: '#52616f',
  slate: '#334e68',
  softMuted: '#627d98',
  surfaceSoft: '#f7f9fb',
};

const framedSurface = css`
  background: white;
  border: 1px solid ${colors.line};
  border-radius: 0.5rem;
`;

const headingScale = css`
  color: ${colors.ink};
  font-size: clamp(2.2rem, 6vw, 4.25rem);
  line-height: 1;
  margin: 0.45rem 0 0.75rem;
`;

const DocumentPageShell = styled.article`
  display: grid;
  gap: 1.5rem;
`;

const Hero = styled.header`
  ${framedSurface}

  padding: clamp(1.5rem, 4vw, 3rem);

  h1 {
    ${headingScale}
  }

  > p {
    color: ${colors.muted};
    line-height: 1.7;
    margin: 0;
    max-width: 70ch;
  }

  dl {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin: 1.5rem 0 0;
  }

  dl div {
    background: ${colors.surfaceSoft};
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
  }

  dt {
    color: ${colors.softMuted};
    font-size: 0.75rem;
    font-weight: 900;
    text-transform: uppercase;
  }

  dd {
    margin: 0.25rem 0 0;
  }
`;

const EyebrowText = styled.p`
  color: ${colors.accent};
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin: 0;
  text-transform: uppercase;
`;

const SourceLabel = styled.span`
  background: ${colors.surfaceSoft};
  border-radius: 0.5rem;
  color: ${colors.muted};
  display: inline-block;
  font-weight: 800;
  line-height: 1.75;
  margin-top: 1rem;
  padding: 0.75rem 1rem;
`;

const NoticeAside = styled.aside`
  ${framedSurface}

  background: ${colors.accentSoft};
  border-color: #99d8ce;
  padding: 1rem;

  strong {
    color: ${colors.accent};
    display: block;
    margin-bottom: 0.35rem;
  }

  p,
  div {
    color: ${colors.slate};
    line-height: 1.6;
    margin: 0;
  }
`;

const StatusAside = styled.aside`
  ${framedSurface}

  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem;

  h2 {
    color: ${colors.ink};
    margin: 0.25rem 0 0.35rem;
  }

  @media (max-width: 820px) {
    align-items: stretch;
    flex-direction: column;
  }
`;

const StatusPanelBody = styled.div`
  color: ${colors.muted};
  line-height: 1.6;
  margin: 0;

  p {
    margin: 0;
  }
`;

const StatusPanelActions = styled.div`
  flex: 0 0 auto;
`;

const StateSection = styled.section`
  ${framedSurface}

  display: grid;
  gap: 1rem;
  max-width: 720px;
  padding: 1.25rem;

  h1 {
    ${headingScale}
  }

  p:not(${EyebrowText}) {
    color: ${colors.muted};
    line-height: 1.7;
    margin: 0;
    max-width: 70ch;
  }
`;

const StyledPrimaryButton = styled.button`
  background: ${colors.accent};
  border: 0;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  font-weight: 900;
  min-height: 2.75rem;
  padding: 0.7rem 1rem;
`;

const DocumentLayout = styled.div`
  align-items: start;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

const SectionNav = styled.nav`
  ${framedSurface}

  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  position: sticky;
  top: 6rem;

  a {
    border-radius: 0.5rem;
    color: ${colors.slate};
    font-weight: 800;
    padding: 0.65rem 0.75rem;
    text-decoration: none;
  }

  a:hover {
    background: ${colors.accentSoft};
    color: ${colors.accent};
  }

  @media (max-width: 820px) {
    position: static;
  }
`;

const SectionList = styled.div`
  display: grid;
  gap: 1rem;
`;

const DocumentSection = styled.section`
  ${framedSurface}

  padding: 1.25rem;

  h2 {
    color: ${colors.ink};
    margin: 0 0 0.75rem;
  }

  p {
    color: ${colors.muted};
    line-height: 1.75;
    margin: 0 0 1rem;
  }

  p:last-child {
    margin-bottom: 0;
  }
`;
