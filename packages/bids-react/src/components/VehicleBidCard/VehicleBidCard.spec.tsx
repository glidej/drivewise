import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { VehicleBidCard } from './VehicleBidCard';
import { outbidSummary, vehicle } from '../../test-fixtures';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('VehicleBidCard', () => {
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    vi.useRealTimers();
    container?.remove();
    container = undefined;
  });

  it('renders bid-list specific state and toggles activity details', async () => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(
        <VehicleBidCard bid={outbidSummary} detailHref="/buy/rav4-hybrid-xse" vehicle={vehicle} />,
      );
    });

    expect(container.textContent).toContain('Bid desk');
    expect(container.textContent).toContain('Your bid needs attention');
    expect(container.textContent).toContain('Outbid');
    expect(container.textContent).toContain('$27,600');
    expect(container.textContent).toContain('#2 of 4');
    expect(container.textContent).toContain('Increase by at least $1,250');
    expect(container.querySelector<HTMLAnchorElement>('a')?.getAttribute('href')).toBe(
      '/buy/rav4-hybrid-xse',
    );

    await act(async () => {
      container?.querySelector<HTMLButtonElement>('button')?.click();
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(container.textContent).toContain('event');

    await act(async () => root.unmount());
  });
});
