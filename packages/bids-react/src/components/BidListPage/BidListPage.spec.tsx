import { QueryClient } from '@tanstack/react-query';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { buildBidList } from '@drivewise/common-data';

import { renderBidListForTest } from '../../mount';
import { setFetchBidListForTest } from '../../services/bidListService';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('BidListPage', () => {
  let container: HTMLDivElement | undefined;
  let resetFetchBidList: (() => void) | undefined;

  afterEach(() => {
    resetFetchBidList?.();
    resetFetchBidList = undefined;
    container?.remove();
    container = undefined;
  });

  it('renders bid vehicles from the package-owned query', async () => {
    const onViewVehicle = vi.fn();
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      renderBidListForTest(root, queryClient, { onViewVehicle });
    });
    await waitForText(container, '4 active bids');

    expect(container.textContent).toContain('RAV4 Hybrid XSE');
    expect(container.textContent).toContain('Bid desk');
    expect(container.textContent).toContain('Winning bid');
    expect(container.textContent).toContain('Dealer countered');

    const detailsButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('View details'),
    );

    await act(async () => {
      detailsButton?.click();
    });

    expect(onViewVehicle).toHaveBeenCalledWith('rav4-hybrid-xse-2024');

    await act(async () => root.unmount());
  });

  it('renders empty bid state', async () => {
    resetFetchBidList = setFetchBidListForTest(async () => []);
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      renderBidListForTest(root, queryClient, { onViewVehicle: vi.fn() });
    });
    await waitForText(container, 'No active bids');

    expect(container.textContent).toContain('0 active bids');

    await act(async () => root.unmount());
  });

  it('renders a retry affordance when bid loading fails', async () => {
    resetFetchBidList = setFetchBidListForTest(async () => {
      throw new Error('No bids for you today');
    });
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      renderBidListForTest(root, queryClient, { onViewVehicle: vi.fn() });
    });
    await waitForText(container, 'We could not load active bids');

    expect(container.textContent).toContain('Try again');

    await act(async () => root.unmount());
  });

  it('renders the loading state while the query is pending', async () => {
    resetFetchBidList = setFetchBidListForTest(() => new Promise(() => undefined));
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      renderBidListForTest(root, queryClient, { onViewVehicle: vi.fn() });
    });

    expect(container.textContent).toContain('Loading active bids');

    await act(async () => root.unmount());
  });

  it('expands the live activity feed for a bid card', async () => {
    resetFetchBidList = setFetchBidListForTest(async () => buildBidList().slice(0, 1));
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      renderBidListForTest(root, queryClient, { onViewVehicle: vi.fn() });
    });
    await waitForText(container, 'Show live feed');

    const feedButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Show live feed'),
    );

    await act(async () => {
      feedButton?.click();
    });

    expect(container.textContent).toContain('Opening mock dealer activity socket');

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
