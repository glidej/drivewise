import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { mountBidList } from './mount';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('mountBidList', () => {
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    container?.remove();
    container = undefined;
  });

  it('mounts and unmounts the bid list page', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    let mounted = mountBidList(container, { onViewVehicle: vi.fn() });
    await waitForText(container, 'Track active mock vehicle bids.');

    act(() => {
      mounted.unmount();
    });

    expect(container.textContent).toBe('');

    mounted = mountBidList(container, { onViewVehicle: vi.fn() });
    await waitForText(container, 'Track active mock vehicle bids.');

    act(() => {
      mounted.unmount();
    });
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
