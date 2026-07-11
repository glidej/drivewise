import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { resetMockAuthStateForTest } from '@drivewise/auth-state';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    resetMockAuthStateForTest();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  afterEach(() => {
    resetMockAuthStateForTest();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the Drivewise shell navigation', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const navText = compiled.querySelector('nav')?.textContent ?? '';

    expect(compiled.textContent).toContain('Drivewise');
    expect(navText).toContain('Learn');
    expect(navText).toContain('Buy');
    expect(navText).toContain('Sell');
    expect(navText).toContain('Bids');
    expect(navText).toContain('Profile');
    expect(compiled.textContent).toContain('Terms of Service');
    expect(compiled.textContent).toContain('Privacy Policy');
  });

  it('should synchronize mock auth controls through shared storage state', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const signInButton = Array.from(compiled.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Sign in demo'),
    );

    signInButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(compiled.textContent).toContain('Signed in');
    expect(compiled.textContent).toContain('Taylor Brooks');
  });
});
