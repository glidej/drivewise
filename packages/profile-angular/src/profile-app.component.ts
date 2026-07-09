import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { Component, OnDestroy, OnInit, computed, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  AuthSnapshot,
  AuthUnsubscribe,
  getAuthSnapshot,
  resumeMockSession,
  signInMockUser,
  signOutMockUser,
  subscribeAuthState,
} from '@drivewise/auth-state';

import { getAnonymousProfilePreview, getLegacyProfileForUser } from './profile-data';

@Component({
  selector: 'drivewise-profile-app',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, NgClass, ReactiveFormsModule],
  template: `
    <article class="profile-mf">
      <header class="profile-hero">
        <p class="eyebrow">Legacy Angular microfrontend</p>
        <h1>Drivewise profile</h1>
        <p>
          This profile experience is a standalone Angular app mounted inside the Angular shell. It
          is isolated as a legacy microfrontend so the team can migrate or replace it later.
        </p>
        <span class="runtime-badge">Mounted from @drivewise/profile-angular</span>
      </header>

      <section class="auth-card" aria-label="Synchronized mock authentication">
        @if (authSnapshot().status === 'authenticated' && profile(); as profile) {
          <div>
            <p class="eyebrow">Shared auth state</p>
            <h2>{{ profile.displayName }}</h2>
            <p>{{ profile.email }} · {{ profile.loyaltyTier }}</p>
          </div>
          <button type="button" (click)="signOut()">Sign out in profile</button>
        } @else if (authSnapshot().rememberedProfile; as rememberedProfile) {
          <div>
            <p class="eyebrow">Remembered profile</p>
            <h2>{{ rememberedProfile.user.name }}</h2>
            <p>Resume the session from localStorage and sessionStorage.</p>
          </div>
          <button type="button" (click)="resume()">Resume in profile</button>
        } @else {
          <div>
            <p class="eyebrow">Anonymous profile preview</p>
            <h2>Sign in to personalize the profile</h2>
            <p>This legacy app can update the same auth state used by Angular chrome and React.</p>
          </div>
          <button type="button" (click)="signIn()">Sign in in profile</button>
        }
      </section>

      @if (profile(); as profile) {
        <section class="profile-grid">
          <div class="panel account-panel">
            <p class="eyebrow">Account</p>
            <dl>
              <div>
                <dt>Member since</dt>
                <dd>{{ profile.memberSince | date: 'mediumDate' : 'UTC' }}</dd>
              </div>
              <div>
                <dt>Preferred dealer</dt>
                <dd>{{ profile.preferredDealer }}</dd>
              </div>
              <div>
                <dt>Contact window</dt>
                <dd>{{ profile.preferences.preferredContactWindow }}</dd>
              </div>
            </dl>
          </div>

          <form class="panel preferences-panel" [formGroup]="preferencesForm">
            <p class="eyebrow">Preference draft</p>
            <label>
              Market area
              <input type="text" formControlName="marketArea" />
            </label>
            <label class="check-row">
              <input type="checkbox" formControlName="emailUpdates" />
              Email inventory updates
            </label>
            <label class="check-row">
              <input type="checkbox" formControlName="smsAlerts" />
              SMS offer alerts
            </label>
            <p class="form-note">Draft only. This package owns profile UI state for isolation.</p>
          </form>
        </section>
      }

      <section class="profile-grid">
        <div class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Garage</p>
              <h2>{{ garage().length }} vehicles</h2>
            </div>
          </div>
          <div class="vehicle-list">
            @for (vehicle of garage(); track vehicle.id) {
              <article>
                <span [ngClass]="vehicle.relationship.toLowerCase()">{{ vehicle.relationship }}</span>
                <h3>{{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}</h3>
                <p>{{ vehicle.valueEstimate | currency: 'USD' : 'symbol' : '1.0-0' }} estimate</p>
              </article>
            }
          </div>
        </div>

        <div class="panel">
          <div class="panel-heading">
            <div>
              <p class="eyebrow">Saved searches</p>
              <h2>{{ savedSearches().length }} searches</h2>
            </div>
          </div>
          <div class="search-list">
            @for (search of savedSearches(); track search.id) {
              <article>
                <strong>{{ search.label }}</strong>
                <p>{{ search.filters }}</p>
                <span>{{ search.newMatches }} new matches</span>
              </article>
            }
          </div>
        </div>
      </section>

      @if (profile(); as profile) {
        <section class="panel activity-panel">
          <p class="eyebrow">Recent activity</p>
          <ol>
            @for (activity of profile.activity; track activity.id) {
              <li>
                <strong>{{ activity.label }}</strong>
                <span>{{ activity.happenedAt | date: 'medium' }}</span>
              </li>
            }
          </ol>
        </section>
      }
    </article>
  `,
  styles: [
    `
      :host {
        color: #14213d;
        display: block;
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }

      .profile-mf {
        display: grid;
        gap: 1.5rem;
      }

      .profile-hero,
      .auth-card,
      .panel {
        background: white;
        border: 1px solid #d9e2ec;
        border-radius: 0.75rem;
      }

      .profile-hero {
        padding: clamp(1.5rem, 4vw, 3rem);
      }

      .profile-hero h1 {
        font-size: clamp(2.2rem, 6vw, 4.25rem);
        line-height: 1;
        margin: 0.45rem 0 0.75rem;
      }

      .profile-hero > p {
        color: #52616f;
        line-height: 1.7;
        margin: 0;
        max-width: 70ch;
      }

      .eyebrow {
        color: #0f766e;
        font-size: 0.78rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        margin: 0;
        text-transform: uppercase;
      }

      .runtime-badge {
        background: #f7f9fb;
        border-radius: 0.5rem;
        color: #52616f;
        display: inline-block;
        font-weight: 800;
        margin-top: 1rem;
        padding: 0.75rem 1rem;
      }

      .auth-card {
        align-items: center;
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        padding: 1rem;
      }

      .auth-card h2,
      .panel h2,
      .vehicle-list h3 {
        margin: 0.25rem 0;
      }

      .auth-card p:not(.eyebrow),
      .vehicle-list p,
      .search-list p,
      .form-note {
        color: #52616f;
        line-height: 1.6;
        margin: 0;
      }

      button {
        background: #0f766e;
        border: 0;
        border-radius: 0.5rem;
        color: white;
        cursor: pointer;
        font-weight: 900;
        min-height: 2.75rem;
        padding: 0.7rem 1rem;
      }

      .profile-grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .panel {
        padding: 1.25rem;
      }

      .account-panel dl {
        display: grid;
        gap: 0.75rem;
        margin: 1rem 0 0;
      }

      .account-panel dl div {
        background: #f7f9fb;
        border-radius: 0.5rem;
        padding: 0.75rem;
      }

      dt {
        color: #627d98;
        font-size: 0.75rem;
        font-weight: 900;
        text-transform: uppercase;
      }

      dd {
        margin: 0.25rem 0 0;
      }

      .preferences-panel {
        display: grid;
        gap: 0.8rem;
      }

      .preferences-panel label {
        color: #334e68;
        display: grid;
        font-weight: 800;
        gap: 0.35rem;
      }

      .preferences-panel input[type='text'] {
        border: 1px solid #bcccdc;
        border-radius: 0.5rem;
        min-height: 2.65rem;
        padding: 0.55rem 0.65rem;
      }

      .check-row {
        align-items: center;
        display: flex !important;
      }

      .panel-heading {
        align-items: center;
        display: flex;
        justify-content: space-between;
        margin-bottom: 1rem;
      }

      .vehicle-list,
      .search-list,
      .activity-panel ol {
        display: grid;
        gap: 0.75rem;
      }

      .vehicle-list article,
      .search-list article,
      .activity-panel li {
        background: #f7f9fb;
        border-radius: 0.5rem;
        padding: 0.85rem;
      }

      .vehicle-list span,
      .search-list span {
        background: #e6f4f1;
        border-radius: 999px;
        color: #0f766e;
        display: inline-block;
        font-size: 0.75rem;
        font-weight: 900;
        margin-bottom: 0.45rem;
        padding: 0.3rem 0.55rem;
      }

      .vehicle-list span.shopping {
        background: #eef2ff;
        color: #4338ca;
      }

      .activity-panel ol {
        list-style: none;
        margin: 1rem 0 0;
        padding: 0;
      }

      .activity-panel li {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem 1rem;
        justify-content: space-between;
      }

      .activity-panel span {
        color: #627d98;
      }

      @media (max-width: 820px) {
        .profile-grid {
          grid-template-columns: 1fr;
        }

        .auth-card {
          align-items: stretch;
          flex-direction: column;
        }
      }
    `,
  ],
})
export class ProfileAppComponent implements OnInit, OnDestroy {
  protected readonly authSnapshot = signal<AuthSnapshot>(getAuthSnapshot());
  protected readonly profile = computed(() => {
    const user = this.authSnapshot().user;

    return user ? getLegacyProfileForUser(user) : null;
  });
  protected readonly anonymousPreview = getAnonymousProfilePreview();
  protected readonly garage = computed(() => this.profile()?.garage ?? this.anonymousPreview.garage);
  protected readonly savedSearches = computed(
    () => this.profile()?.savedSearches ?? this.anonymousPreview.savedSearches,
  );
  protected readonly preferencesForm = new FormGroup({
    marketArea: new FormControl('', { nonNullable: true }),
    emailUpdates: new FormControl(false, { nonNullable: true }),
    smsAlerts: new FormControl(false, { nonNullable: true }),
  });

  private unsubscribe?: AuthUnsubscribe;

  ngOnInit(): void {
    this.unsubscribe = subscribeAuthState((snapshot) => {
      this.authSnapshot.set(snapshot);
      this.syncPreferencesForm();
    });
    this.syncPreferencesForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe?.();
  }

  protected signIn(): void {
    this.authSnapshot.set(signInMockUser({ rememberDevice: true }));
    this.syncPreferencesForm();
  }

  protected resume(): void {
    this.authSnapshot.set(resumeMockSession());
    this.syncPreferencesForm();
  }

  protected signOut(): void {
    this.authSnapshot.set(signOutMockUser());
    this.syncPreferencesForm();
  }

  private syncPreferencesForm(): void {
    const preferences = this.profile()?.preferences;

    if (!preferences) {
      this.preferencesForm.reset({
        marketArea: '',
        emailUpdates: false,
        smsAlerts: false,
      });
      return;
    }

    this.preferencesForm.setValue(
      {
        marketArea: preferences.marketArea,
        emailUpdates: preferences.emailUpdates,
        smsAlerts: preferences.smsAlerts,
      },
      { emitEvent: false },
    );
  }
}
