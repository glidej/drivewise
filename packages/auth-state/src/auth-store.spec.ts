import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  AUTH_PROFILE_STORAGE_KEY,
  AUTH_SESSION_STORAGE_KEY,
  getAuthSnapshot,
  resetMockAuthStateForTest,
  resumeMockSession,
  signInMockUser,
  signOutMockUser,
  subscribeAuthState,
} from './index';

describe('auth-store', () => {
  afterEach(() => {
    resetMockAuthStateForTest();
    vi.restoreAllMocks();
  });

  it('persists remembered profile in localStorage and session in sessionStorage', () => {
    const snapshot = signInMockUser();

    expect(snapshot.status).toBe('authenticated');
    expect(snapshot.user?.name).toBe('Taylor Brooks');
    expect(localStorage.getItem(AUTH_PROFILE_STORAGE_KEY)).toContain('Taylor Brooks');
    expect(sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toContain('mock-session');
  });

  it('signs out of the session while keeping the remembered profile', () => {
    signInMockUser();
    const snapshot = signOutMockUser();

    expect(snapshot.status).toBe('anonymous');
    expect(snapshot.user).toBeNull();
    expect(snapshot.rememberedProfile?.user.name).toBe('Taylor Brooks');
    expect(sessionStorage.getItem(AUTH_SESSION_STORAGE_KEY)).toBeNull();
  });

  it('resumes a session from the remembered localStorage profile', () => {
    signInMockUser();
    signOutMockUser();

    const snapshot = resumeMockSession();

    expect(snapshot.status).toBe('authenticated');
    expect(snapshot.user?.email).toBe('taylor.brooks@example.test');
  });

  it('notifies subscribers when auth state changes', () => {
    const subscriber = vi.fn();
    const unsubscribe = subscribeAuthState(subscriber);

    signInMockUser();
    unsubscribe();
    signOutMockUser();

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber.mock.calls[0][0].status).toBe('authenticated');
  });

  it('returns defensive snapshots', () => {
    const snapshot = signInMockUser();

    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot.user)).toBe(true);
    expect(() => {
      snapshot.user!.name = 'Mutated User';
    }).toThrow();

    expect(getAuthSnapshot().user?.name).toBe('Taylor Brooks');
  });
});
