import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useVehicleActivityStream } from './useVehicleActivityStream';
import { vehicle } from '../test-fixtures';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

describe('useVehicleActivityStream', () => {
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    vi.useRealTimers();
    container?.remove();
    container = undefined;
  });

  it('emits initial, live, and reconnecting states with cleanup', async () => {
    vi.useFakeTimers();
    container = document.createElement('div');
    document.body.appendChild(container);
    const root = createRoot(container);

    await act(async () => {
      root.render(<ActivityProbe />);
    });

    expect(container.textContent).toContain('connecting');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });
    expect(container.textContent).toContain('live');

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1800);
    });
    expect(container.textContent).toContain('reconnecting');

    await act(async () => root.unmount());
  });
});

function ActivityProbe() {
  const activity = useVehicleActivityStream(vehicle);

  return (
    <p>
      {activity.connection}:{activity.recentEvents[0]?.kind}:{activity.watchers}
    </p>
  );
}
