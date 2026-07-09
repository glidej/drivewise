import { act } from 'react';
import { resetMockAuthStateForTest } from '@drivewise/auth-state';
import { afterEach, describe, expect, it } from 'vitest';

import { mountLegalDocument } from './mount';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('mountLegalDocument', () => {
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    resetMockAuthStateForTest();
    container?.remove();
    container = undefined;
  });

  it('mounts, updates, and unmounts the React legal page', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    let mounted: ReturnType<typeof mountLegalDocument>;

    await act(async () => {
      mounted = mountLegalDocument(container!, { documentId: 'terms' });
    });
    await waitForText(container, 'Terms of Service');

    expect(document.getElementById('drivewise-react-ui-styles')).toBeTruthy();

    await act(async () => {
      mounted!.update({
        documentId: 'privacy',
        privacyDocument: {
          id: 'privacy',
          title: 'Privacy Policy',
          eyebrow: 'Injected privacy',
          summary: 'Lorem ipsum supplied by Angular.',
          effectiveDate: '2026-07-09',
          lastUpdated: '2026-07-09',
          sections: [{ heading: 'Information We Collect', body: ['Lorem ipsum dolor sit amet.'] }],
        },
      });
    });

    expect(container.textContent).toContain('Privacy Policy');
    expect(container.textContent).toContain('Injected privacy');

    await act(async () => mounted!.unmount());
    expect(container.textContent).toBe('');
  });
});

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
