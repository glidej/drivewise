import {
  AUTH_PROFILE_STORAGE_KEY,
  AUTH_SESSION_STORAGE_KEY,
  AUTH_STATE_EVENT,
  clearAuthSession,
  clearRememberedProfile,
  readAuthSession,
  readRememberedProfile,
  writeAuthSession,
  writeRememberedProfile,
} from './storage';
import {
  AuthSession,
  AuthSnapshot,
  AuthSubscriber,
  AuthUnsubscribe,
  AuthUser,
  RememberedAuthProfile,
  SignInOptions,
} from './types';

const MOCK_USER: AuthUser = {
  id: 'user-taylor-brooks',
  name: 'Taylor Brooks',
  email: 'taylor.brooks@example.test',
  role: 'Buyer',
  preferredDealerId: 'drivewise-detroit',
};

const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;
const subscriberSet = new Set<AuthSubscriber>();
const instanceId = `auth-state-${Math.random().toString(36).slice(2)}`;
let globalListenersStarted = false;

export const DEFAULT_MOCK_USER: AuthUser = cloneUser(MOCK_USER);

export function getAuthSnapshot(): AuthSnapshot {
  const rememberedProfile = readRememberedProfile();
  const session = readValidSession(rememberedProfile);

  return cloneSnapshot({
    status: session && rememberedProfile ? 'authenticated' : 'anonymous',
    user: session && rememberedProfile ? rememberedProfile.user : null,
    rememberedProfile,
    session,
  });
}

export function subscribeAuthState(subscriber: AuthSubscriber): AuthUnsubscribe {
  startGlobalListeners();
  subscriberSet.add(subscriber);

  return () => {
    subscriberSet.delete(subscriber);
  };
}

export function signInMockUser(options: SignInOptions = {}): AuthSnapshot {
  const user = options.user ?? MOCK_USER;
  const now = new Date();
  const rememberedProfile: RememberedAuthProfile = {
    user,
    rememberDevice: options.rememberDevice ?? true,
    lastAuthenticatedAt: now.toISOString(),
  };

  writeRememberedProfile(rememberedProfile);
  writeAuthSession(createSession(user, now));

  return broadcastAuthChange();
}

export function resumeMockSession(): AuthSnapshot {
  const rememberedProfile = readRememberedProfile();

  if (!rememberedProfile) {
    return signInMockUser();
  }

  writeAuthSession(createSession(rememberedProfile.user, new Date()));

  return broadcastAuthChange();
}

export function signOutMockUser(): AuthSnapshot {
  clearAuthSession();

  return broadcastAuthChange();
}

export function forgetMockUser(): AuthSnapshot {
  clearAuthSession();
  clearRememberedProfile();

  return broadcastAuthChange();
}

export function resetMockAuthStateForTest(): AuthSnapshot {
  clearAuthSession();
  clearRememberedProfile();

  return broadcastAuthChange();
}

function readValidSession(rememberedProfile: RememberedAuthProfile | null): AuthSession | null {
  const session = readAuthSession();

  if (!session || !rememberedProfile || session.userId !== rememberedProfile.user.id) {
    return null;
  }

  if (new Date(session.expiresAt).getTime() <= Date.now()) {
    clearAuthSession();
    return null;
  }

  return session;
}

function createSession(user: AuthUser, now: Date): AuthSession {
  return {
    token: `mock-session-${user.id}-${now.getTime()}`,
    userId: user.id,
    issuedAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + SESSION_DURATION_MS).toISOString(),
    lastSeenAt: now.toISOString(),
  };
}

function broadcastAuthChange(): AuthSnapshot {
  const snapshot = getAuthSnapshot();
  notifySubscribers(snapshot);
  window.dispatchEvent(new CustomEvent(AUTH_STATE_EVENT, { detail: { source: instanceId } }));

  return snapshot;
}

function notifySubscribers(snapshot = getAuthSnapshot()): void {
  subscriberSet.forEach((subscriber) => subscriber(snapshot));
}

function startGlobalListeners(): void {
  if (globalListenersStarted) {
    return;
  }

  globalListenersStarted = true;
  window.addEventListener(AUTH_STATE_EVENT, (event) => {
    const detail = (event as CustomEvent<{ source?: string }>).detail;

    if (detail?.source === instanceId) {
      return;
    }

    notifySubscribers();
  });
  window.addEventListener('storage', (event) => {
    if (event.key !== AUTH_PROFILE_STORAGE_KEY && event.key !== AUTH_SESSION_STORAGE_KEY) {
      return;
    }

    notifySubscribers();
  });
}

function cloneSnapshot(snapshot: AuthSnapshot): AuthSnapshot {
  return {
    status: snapshot.status,
    user: snapshot.user ? cloneUser(snapshot.user) : null,
    rememberedProfile: snapshot.rememberedProfile
      ? {
          ...snapshot.rememberedProfile,
          user: cloneUser(snapshot.rememberedProfile.user),
        }
      : null,
    session: snapshot.session ? { ...snapshot.session } : null,
  };
}

function cloneUser(user: AuthUser): AuthUser {
  return { ...user };
}
