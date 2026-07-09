import { describe, expect, it } from 'vitest';

import { getAnonymousProfilePreview, getLegacyProfileForUser } from './profile-data';

describe('profile-data', () => {
  it('maps auth users into a legacy profile shape', () => {
    const profile = getLegacyProfileForUser({
      id: 'user-test',
      name: 'Jamie Rivera',
      email: 'jamie@example.test',
      role: 'Seller',
      preferredDealerId: 'drivewise-novi',
    });

    expect(profile.userId).toBe('user-test');
    expect(profile.displayName).toBe('Jamie Rivera');
    expect(profile.garage.length).toBeGreaterThan(0);
    expect(profile.savedSearches[0].label).toContain('Hybrid SUVs');
  });

  it('returns defensive profile copies', () => {
    const profile = getLegacyProfileForUser({
      id: 'user-test',
      name: 'Jamie Rivera',
      email: 'jamie@example.test',
      role: 'Seller',
      preferredDealerId: 'drivewise-novi',
    });
    profile.garage[0].make = 'Mutated';

    const nextProfile = getLegacyProfileForUser({
      id: 'user-test',
      name: 'Jamie Rivera',
      email: 'jamie@example.test',
      role: 'Seller',
      preferredDealerId: 'drivewise-novi',
    });

    expect(nextProfile.garage[0].make).toBe('Toyota');
  });

  it('returns an anonymous preview for signed-out users', () => {
    const preview = getAnonymousProfilePreview();

    expect(preview.garage.length).toBe(2);
    expect(preview.savedSearches.length).toBe(2);
  });
});
