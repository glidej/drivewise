import { TestBed } from '@angular/core/testing';
import { resetMockAuthStateForTest } from '@drivewise/auth-state';

import { ProfilePageHostComponent } from './profile-page-host.component';

describe('ProfilePageHostComponent', () => {
  beforeEach(async () => {
    resetMockAuthStateForTest();
    await TestBed.configureTestingModule({
      imports: [ProfilePageHostComponent],
    }).compileComponents();
  });

  afterEach(() => {
    resetMockAuthStateForTest();
  });

  it('mounts the standalone Angular profile microfrontend', async () => {
    const fixture = TestBed.createComponent(ProfilePageHostComponent);
    fixture.detectChanges();

    await waitForText(fixture.nativeElement, 'Drivewise profile');

    expect(fixture.nativeElement.textContent).toContain('Mounted from @drivewise/profile-angular');
    expect(fixture.nativeElement.textContent).toContain('Anonymous profile preview');
  });

  it('lets the profile microfrontend update shared auth state', async () => {
    const fixture = TestBed.createComponent(ProfilePageHostComponent);
    fixture.detectChanges();
    await waitForText(fixture.nativeElement, 'Sign in in profile');

    const button = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button'),
    ).find((candidate) =>
      candidate.textContent?.includes('Sign in in profile'),
    );
    button?.click();

    await waitForText(fixture.nativeElement, 'Taylor Brooks');

    expect(fixture.nativeElement.textContent).toContain('Drivewise Plus');
  });
});

async function waitForText(element: HTMLElement, text: string): Promise<void> {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    if (element.textContent?.includes(text)) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  throw new Error(`Timed out waiting for "${text}"`);
}
