import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
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
    expect(compiled.textContent).toContain('Terms of Service');
    expect(compiled.textContent).toContain('Privacy Policy');
  });
});
