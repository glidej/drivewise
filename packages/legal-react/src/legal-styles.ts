const STYLE_ELEMENT_ID = 'drivewise-legal-react-styles';

const styles = `
.legal-react-page {
  display: grid;
  gap: 1.5rem;
}

.legal-react-hero,
.legal-react-disclaimer,
.legal-react-section-nav,
.legal-react-section,
.legal-react-missing,
.legal-react-loading {
  background: white;
  border: 1px solid #d9e2ec;
  border-radius: 0.75rem;
}

.legal-react-hero {
  padding: clamp(1.5rem, 4vw, 3rem);
}

.legal-react-eyebrow {
  color: #0f766e;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin: 0;
  text-transform: uppercase;
}

.legal-react-hero h1,
.legal-react-missing h1 {
  color: #14213d;
  font-size: clamp(2.2rem, 6vw, 4.25rem);
  line-height: 1;
  margin: 0.45rem 0 0.75rem;
}

.legal-react-hero > p,
.legal-react-missing p:not(.legal-react-eyebrow) {
  color: #52616f;
  line-height: 1.7;
  margin: 0;
  max-width: 70ch;
}

.legal-react-hero dl {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0 0;
}

.legal-react-hero dl div,
.legal-react-source {
  background: #f7f9fb;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

.legal-react-page dt {
  color: #627d98;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}

.legal-react-page dd {
  margin: 0.25rem 0 0;
}

.legal-react-disclaimer {
  background: #e6f4f1;
  border-color: #99d8ce;
  padding: 1rem;
}

.legal-react-disclaimer strong {
  color: #0f766e;
  display: block;
  margin-bottom: 0.35rem;
}

.legal-react-disclaimer p {
  color: #334e68;
  line-height: 1.6;
  margin: 0;
}

.legal-react-layout {
  align-items: start;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
}

.legal-react-section-nav {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  position: sticky;
  top: 6rem;
}

.legal-react-section-nav a {
  border-radius: 0.5rem;
  color: #334e68;
  font-weight: 800;
  padding: 0.65rem 0.75rem;
  text-decoration: none;
}

.legal-react-section-nav a:hover {
  background: #e6f4f1;
  color: #0f766e;
}

.legal-react-section-list {
  display: grid;
  gap: 1rem;
}

.legal-react-section,
.legal-react-missing,
.legal-react-loading {
  padding: 1.25rem;
}

.legal-react-section h2 {
  color: #14213d;
  margin: 0 0 0.75rem;
}

.legal-react-section p,
.legal-react-source {
  color: #52616f;
  line-height: 1.75;
  margin: 0 0 1rem;
}

.legal-react-section p:last-child {
  margin-bottom: 0;
}

.legal-react-missing,
.legal-react-loading {
  display: grid;
  gap: 1rem;
  max-width: 720px;
}

.legal-react-source {
  display: inline-block;
  font-weight: 800;
  margin-top: 1rem;
}

@media (max-width: 820px) {
  .legal-react-layout {
    grid-template-columns: 1fr;
  }

  .legal-react-section-nav {
    position: static;
  }
}
`;

export function ensureLegalReactStyles(targetDocument = document): void {
  if (targetDocument.getElementById(STYLE_ELEMENT_ID)) {
    return;
  }

  const styleElement = targetDocument.createElement('style');
  styleElement.id = STYLE_ELEMENT_ID;
  styleElement.textContent = styles;
  targetDocument.head.appendChild(styleElement);
}
