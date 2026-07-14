import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';

import { BidListPage } from './BidListPage';
import { VehicleBidListItem } from '../../types';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('BidListPage', () => {
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    container?.remove();
    container = undefined;
  });

  it('renders active bids with bid-specific card state and details links', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <BidListPage detailHrefForVehicle={(vehicle) => `/buy/${vehicle.id}`} />
        </QueryClientProvider>,
      );
    });
    await waitForText(container, '4 active bids');

    expect(container.textContent).toContain('RAV4 Hybrid XSE');
    expect(container.textContent).toContain('Bid desk');
    expect(container.textContent).toContain('Winning bid');
    expect(container.textContent).toContain('Dealer countered');
    expect(container.querySelectorAll('article').length).toBe(4);
    expect(
      container.querySelector<HTMLAnchorElement>('a[href="/buy/rav4-hybrid-xse-2024"]'),
    ).toBeTruthy();

    await act(async () => root.unmount());
  });

  it('renders an empty state', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <BidListPage
            detailHrefForVehicle={(vehicle) => `/buy/${vehicle.id}`}
            fetchBids={async () => []}
          />
        </QueryClientProvider>,
      );
    });
    await waitForText(container, 'No active bids');

    expect(container.textContent).toContain('Place a mock bid');

    await act(async () => root.unmount());
  });

  it('renders a visible error state', async () => {
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);
    const queryClient = createQueryClient();

    await act(async () => {
      root.render(
        <QueryClientProvider client={queryClient}>
          <BidListPage
            detailHrefForVehicle={(vehicle) => `/buy/${vehicle.id}`}
            fetchBids={async (): Promise<VehicleBidListItem[]> => {
              throw new Error('Mock bid list failed');
            }}
          />
        </QueryClientProvider>,
      );
    });
    await waitForText(container, 'We could not load active bids.');

    expect(container.textContent).toContain('mock bid desk recovers');

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
