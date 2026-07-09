import { QueryClient } from '@tanstack/react-query';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';

import { renderLegalDocumentForTest } from './mount';
import { LegalDocument } from './types';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const privacyDocument: LegalDocument = {
  id: 'privacy',
  title: 'Privacy Policy',
  eyebrow: 'Angular supplied privacy structure',
  summary: 'Placeholder privacy page supplied by Angular for the React microfrontend.',
  effectiveDate: '2026-07-09',
  lastUpdated: '2026-07-09',
  sections: [
    {
      heading: 'Information We Collect',
      body: ['Lorem ipsum dolor sit amet.'],
    },
    {
      heading: 'Mock Data and Demonstration Records',
      body: ['Suspendisse potenti.'],
    },
  ],
};

describe('LegalDocumentPage', () => {
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    container?.remove();
    container = undefined;
  });

  it('renders terms data fetched by React Query inside the package', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      renderLegalDocumentForTest(root, queryClient, { documentId: 'terms' });
    });
    await waitForText(container, 'React Query demo legal structure');

    expect(container.textContent).toContain('React Query demo legal structure');
    expect(container.textContent).toContain('Terms data fetched inside legal-react');

    await act(async () => root.unmount());
  });

  it('renders privacy data injected through props', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      renderLegalDocumentForTest(root, queryClient, {
        documentId: 'privacy',
        privacyDocument,
      });
    });

    expect(container.textContent).toContain('Privacy Policy');
    expect(container.textContent).toContain('Information We Collect');
    expect(container.textContent).toContain('Privacy data supplied by Angular');

    await act(async () => root.unmount());
  });
});

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

async function waitForText(container: HTMLElement, text: string): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (container.textContent?.includes(text)) {
      return;
    }

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  throw new Error(`Timed out waiting for "${text}"`);
}
