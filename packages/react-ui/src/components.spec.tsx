import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';

import {
  DocumentPage,
  EmptyState,
  NoticeCard,
  PrimaryButton,
  StatusPanel,
  sectionId,
} from './index';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('react-ui components', () => {
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    container?.remove();
    container = undefined;
  });

  it('renders a document page with metadata, section navigation, and slugs', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <DocumentPage
          eyebrow="Demo document"
          title="Terms of Service"
          summary="Structured placeholder content."
          metadata={[{ label: 'Effective date', value: 'Jul 9, 2026' }]}
          sourceLabel="Fetched by a microfrontend"
          notice={
            <NoticeCard title="Placeholder content">
              <p>Not legally binding.</p>
            </NoticeCard>
          }
          sections={[
            { heading: 'Information We Collect', body: ['Lorem ipsum dolor sit amet.'] },
            {
              heading: 'Mock Data and Demonstration Records',
              body: ['Suspendisse potenti.'],
            },
          ]}
        >
          <StatusPanel
            eyebrow="Shared state"
            title="Signed in as Taylor Brooks"
            actions={<PrimaryButton type="button">Sign out</PrimaryButton>}
          >
            <p>React can share state with the shell.</p>
          </StatusPanel>
        </DocumentPage>,
      );
    });

    expect(container.textContent).toContain('Terms of Service');
    expect(container.textContent).toContain('Fetched by a microfrontend');
    expect(container.textContent).toContain('Placeholder content');
    expect(container.textContent).toContain('Signed in as Taylor Brooks');
    expect(container.querySelector('a[href="#information-we-collect"]')).toBeTruthy();
    expect(container.querySelector('#mock-data-and-demonstration-records')).toBeTruthy();
    expect(document.head.querySelector('style[data-styled]')).toBeTruthy();

    await act(async () => root.unmount());
  });

  it('renders a reusable empty state', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <EmptyState eyebrow="Loading" title="Preparing content">
          <p>Fetching mocked data.</p>
        </EmptyState>,
      );
    });

    expect(container.textContent).toContain('Loading');
    expect(container.textContent).toContain('Preparing content');
    expect(container.textContent).toContain('Fetching mocked data.');

    await act(async () => root.unmount());
  });

  it('creates stable section ids from headings', () => {
    expect(sectionId('Mock Data and Demonstration Records')).toBe(
      'mock-data-and-demonstration-records',
    );
    expect(sectionId('  ')).toBe('section');
  });
});
