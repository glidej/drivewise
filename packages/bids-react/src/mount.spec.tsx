import { act } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { mountBidList } from './mount';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('mountBidList', () => {
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    container?.remove();
    container = undefined;
  });

  it('mounts, updates, unmounts, and can remount the React bid list', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);

    let mounted: ReturnType<typeof mountBidList>;

    await act(async () => {
      mounted = mountBidList(container!, {
        detailHrefForVehicle: (vehicle) => `/buy/${vehicle.id}`,
      });
    });
    await waitForText(container, '4 active bids');

    expect(document.head.querySelector('style[data-styled]')).toBeTruthy();
    expect(
      container.querySelector<HTMLAnchorElement>('a[href="/buy/rav4-hybrid-xse-2024"]'),
    ).toBeTruthy();

    await act(async () => {
      mounted!.update({ detailHrefForVehicle: (vehicle) => `/inventory/${vehicle.id}` });
    });
    await waitForSelector(container, 'a[href="/inventory/rav4-hybrid-xse-2024"]');

    await act(async () => mounted!.unmount());
    expect(container.textContent).toBe('');

    await act(async () => {
      mounted = mountBidList(container!, {
        detailHrefForVehicle: (vehicle) => `/buy/${vehicle.id}`,
      });
    });
    await waitForText(container, '4 active bids');
    await act(async () => mounted!.unmount());
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

async function waitForSelector(container: HTMLElement, selector: string): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (container.querySelector(selector)) {
      return;
    }

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  }

  throw new Error(`Timed out waiting for "${selector}"`);
}
