import {
  getAuthSnapshot,
  resumeMockSession,
  signInMockUser,
  signOutMockUser,
  subscribeAuthState,
} from '@drivewise/auth-state';
import { useSyncExternalStore } from 'react';

export function AuthStatusPanel() {
  const snapshot = useSyncExternalStore(
    (onStoreChange) => subscribeAuthState(() => onStoreChange()),
    getAuthSnapshot,
    getAuthSnapshot,
  );

  if (snapshot.status === 'authenticated' && snapshot.user) {
    return (
      <aside className="legal-react-auth-panel" aria-label="Synchronized mock authentication">
        <div>
          <p className="legal-react-eyebrow">Shared auth state</p>
          <h2>Signed in as {snapshot.user.name}</h2>
          <p>
            React is reading the same sessionStorage token and localStorage profile used by
            Angular.
          </p>
        </div>
        <button type="button" onClick={() => signOutMockUser()}>
          Sign out from React
        </button>
      </aside>
    );
  }

  if (snapshot.rememberedProfile) {
    return (
      <aside className="legal-react-auth-panel" aria-label="Synchronized mock authentication">
        <div>
          <p className="legal-react-eyebrow">Shared auth state</p>
          <h2>{snapshot.rememberedProfile.user.name} is remembered</h2>
          <p>React can resume a mock session from the remembered localStorage profile.</p>
        </div>
        <button type="button" onClick={() => resumeMockSession()}>
          Resume from React
        </button>
      </aside>
    );
  }

  return (
    <aside className="legal-react-auth-panel" aria-label="Synchronized mock authentication">
      <div>
        <p className="legal-react-eyebrow">Shared auth state</p>
        <h2>Viewing legal pages anonymously</h2>
        <p>Sign in here to update Angular chrome and React content from the same auth store.</p>
      </div>
      <button type="button" onClick={() => signInMockUser({ rememberDevice: true })}>
        Sign in from React
      </button>
    </aside>
  );
}
