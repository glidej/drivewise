import { TestBed } from '@angular/core/testing';
import { resetMockAuthStateForTest, signInMockUser } from '@drivewise/auth-state';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    resetMockAuthStateForTest();
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    resetMockAuthStateForTest();
  });

  it('starts anonymous when no session storage exists', () => {
    expect(service.snapshot().status).toBe('anonymous');
  });

  it('signs in through the shared auth state package', () => {
    service.signInDemo();

    expect(service.snapshot().status).toBe('authenticated');
    expect(service.snapshot().user?.name).toBe('Taylor Brooks');
  });

  it('updates when another framework changes shared auth state', () => {
    signInMockUser();

    expect(service.snapshot().status).toBe('authenticated');
    expect(service.snapshot().user?.email).toBe('taylor.brooks@example.test');
  });

  it('signs out while keeping the remembered localStorage profile', () => {
    service.signInDemo();
    service.signOut();

    expect(service.snapshot().status).toBe('anonymous');
    expect(service.snapshot().rememberedProfile?.user.name).toBe('Taylor Brooks');
  });
});
