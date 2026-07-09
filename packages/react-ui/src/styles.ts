const STYLE_ELEMENT_ID = 'drivewise-react-ui-styles';

const styles = `
.dw-react-ui-document-page {
  display: grid;
  gap: 1.5rem;
}

.dw-react-ui-hero,
.dw-react-ui-notice,
.dw-react-ui-status-panel,
.dw-react-ui-section-nav,
.dw-react-ui-section,
.dw-react-ui-state {
  background: white;
  border: 1px solid #d9e2ec;
  border-radius: 0.5rem;
}

.dw-react-ui-hero {
  padding: clamp(1.5rem, 4vw, 3rem);
}

.dw-react-ui-eyebrow {
  color: #0f766e;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin: 0;
  text-transform: uppercase;
}

.dw-react-ui-hero h1,
.dw-react-ui-state h1 {
  color: #14213d;
  font-size: clamp(2.2rem, 6vw, 4.25rem);
  line-height: 1;
  margin: 0.45rem 0 0.75rem;
}

.dw-react-ui-hero > p,
.dw-react-ui-state p:not(.dw-react-ui-eyebrow) {
  color: #52616f;
  line-height: 1.7;
  margin: 0;
  max-width: 70ch;
}

.dw-react-ui-hero dl {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin: 1.5rem 0 0;
}

.dw-react-ui-hero dl div,
.dw-react-ui-source {
  background: #f7f9fb;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
}

.dw-react-ui-document-page dt {
  color: #627d98;
  font-size: 0.75rem;
  font-weight: 900;
  text-transform: uppercase;
}

.dw-react-ui-document-page dd {
  margin: 0.25rem 0 0;
}

.dw-react-ui-notice {
  background: #e6f4f1;
  border-color: #99d8ce;
  padding: 1rem;
}

.dw-react-ui-notice strong {
  color: #0f766e;
  display: block;
  margin-bottom: 0.35rem;
}

.dw-react-ui-notice p,
.dw-react-ui-notice div {
  color: #334e68;
  line-height: 1.6;
  margin: 0;
}

.dw-react-ui-status-panel {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  padding: 1rem;
}

.dw-react-ui-status-panel h2 {
  color: #14213d;
  margin: 0.25rem 0 0.35rem;
}

.dw-react-ui-status-panel-body,
.dw-react-ui-status-panel-body p {
  color: #52616f;
  line-height: 1.6;
  margin: 0;
}

.dw-react-ui-status-panel-actions {
  flex: 0 0 auto;
}

.dw-react-ui-button {
  background: #0f766e;
  border: 0;
  border-radius: 0.5rem;
  color: white;
  cursor: pointer;
  font-weight: 900;
  min-height: 2.75rem;
  padding: 0.7rem 1rem;
}

.dw-react-ui-document-layout {
  align-items: start;
  display: grid;
  gap: 1.5rem;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
}

.dw-react-ui-section-nav {
  display: grid;
  gap: 0.35rem;
  padding: 1rem;
  position: sticky;
  top: 6rem;
}

.dw-react-ui-section-nav a {
  border-radius: 0.5rem;
  color: #334e68;
  font-weight: 800;
  padding: 0.65rem 0.75rem;
  text-decoration: none;
}

.dw-react-ui-section-nav a:hover {
  background: #e6f4f1;
  color: #0f766e;
}

.dw-react-ui-section-list {
  display: grid;
  gap: 1rem;
}

.dw-react-ui-section,
.dw-react-ui-state {
  padding: 1.25rem;
}

.dw-react-ui-section h2 {
  color: #14213d;
  margin: 0 0 0.75rem;
}

.dw-react-ui-section p,
.dw-react-ui-source {
  color: #52616f;
  line-height: 1.75;
  margin: 0 0 1rem;
}

.dw-react-ui-section p:last-child {
  margin-bottom: 0;
}

.dw-react-ui-state {
  display: grid;
  gap: 1rem;
  max-width: 720px;
}

.dw-react-ui-source {
  display: inline-block;
  font-weight: 800;
  margin-top: 1rem;
}

@media (max-width: 820px) {
  .dw-react-ui-document-layout {
    grid-template-columns: 1fr;
  }

  .dw-react-ui-section-nav {
    position: static;
  }

  .dw-react-ui-status-panel {
    align-items: stretch;
    flex-direction: column;
  }
}
`;

export function ensureDrivewiseReactUiStyles(targetDocument = document): void {
  if (targetDocument.getElementById(STYLE_ELEMENT_ID)) {
    return;
  }

  const styleElement = targetDocument.createElement('style');
  styleElement.id = STYLE_ELEMENT_ID;
  styleElement.textContent = styles;
  targetDocument.head.appendChild(styleElement);
}
