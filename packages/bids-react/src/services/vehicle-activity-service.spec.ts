import { describe, expect, it } from 'vitest';

import {
  activityConnectionForElapsed,
  buildInitialVehicleActivityState,
  nextVehicleActivityState,
} from './vehicle-activity-service';
import { vehicle } from '../test-fixtures';

describe('vehicle activity service', () => {
  it('builds deterministic initial activity from vehicle data', () => {
    const snapshot = buildInitialVehicleActivityState(vehicle);

    expect(snapshot.connection).toBe('connecting');
    expect(snapshot.marketSignal).toBe('high-demand');
    expect(snapshot.watchers).toBeGreaterThan(8);
    expect(snapshot.recentEvents[0].label).toBe('Opening mock dealer activity socket');
  });

  it('advances the recent activity feed', () => {
    const initial = buildInitialVehicleActivityState(vehicle);
    const next = nextVehicleActivityState(vehicle, initial, 0);

    expect(next.recentEvents[0].sequence).toBe(1);
    expect(next.recentEvents.length).toBe(2);
  });

  it('matches the mock connection timing contract', () => {
    expect(activityConnectionForElapsed(0)).toBe('connecting');
    expect(activityConnectionForElapsed(300)).toBe('live');
    expect(activityConnectionForElapsed(2100)).toBe('reconnecting');
    expect(activityConnectionForElapsed(2600)).toBe('live');
  });
});
