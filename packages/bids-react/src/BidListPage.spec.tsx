import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { BidListPage } from './BidListPage';

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
let root: ReturnType<typeof createRoot> | undefined;
afterEach(() => { if (root) act(() => root?.unmount()); root = undefined; });

describe('BidListPage', () => {
  it('renders active bids and sends vehicle navigation through its callback', async () => {
    const container = document.createElement('div');
    root = createRoot(container);
    const onViewVehicle = vi.fn();
    await act(async () => {
      root?.render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><BidListPage onViewVehicle={onViewVehicle} /></QueryClientProvider>);
    });
    await waitForText(container, '4 active bids');
    expect(container.textContent).toContain('4 active bids');
    expect(container.textContent).toContain('Winning bid');
    expect(container.textContent).toContain('Dealer countered');
    const button = Array.from(container.querySelectorAll('button')).find((item) => item.textContent === 'View details');
    act(() => button?.click());
    expect(onViewVehicle).toHaveBeenCalledWith('rav4-hybrid-xse-2024');
  });
});

async function waitForText(container: HTMLElement, text: string) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (container.textContent?.includes(text)) return;
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 0)); });
  }
  throw new Error(`Timed out waiting for ${text}`);
}
