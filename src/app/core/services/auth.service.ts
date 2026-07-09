import { Injectable, OnDestroy, signal } from '@angular/core';
import {
  forgetMockUser,
  getAuthSnapshot,
  resetMockAuthStateForTest,
  resumeMockSession,
  signInMockUser,
  signOutMockUser,
  subscribeAuthState,
  type AuthSnapshot,
  type AuthUnsubscribe,
} from '@drivewise/auth-state';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnDestroy {
  private readonly unsubscribe: AuthUnsubscribe;
  private readonly snapshotSignal = signal<AuthSnapshot>(getAuthSnapshot());

  readonly snapshot = this.snapshotSignal.asReadonly();

  constructor() {
    this.unsubscribe = subscribeAuthState((snapshot) => {
      this.snapshotSignal.set(snapshot);
    });
  }

  signInDemo(): void {
    this.snapshotSignal.set(signInMockUser({ rememberDevice: true }));
  }

  resumeDemoSession(): void {
    this.snapshotSignal.set(resumeMockSession());
  }

  signOut(): void {
    this.snapshotSignal.set(signOutMockUser());
  }

  forgetDemoUser(): void {
    this.snapshotSignal.set(forgetMockUser());
  }

  resetForTest(): void {
    this.snapshotSignal.set(resetMockAuthStateForTest());
  }

  ngOnDestroy(): void {
    this.unsubscribe();
  }
}
