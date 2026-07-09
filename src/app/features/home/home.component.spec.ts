import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the marketplace positioning and primary actions', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('fully mocked marketplace');
    expect(compiled.textContent).toContain('Browse inventory');
    expect(compiled.textContent).toContain('Start a seller offer');
  });

  it('renders featured vehicles from the inventory service', async () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const cards = fixture.nativeElement.querySelectorAll('.vehicle-card');

    expect(cards.length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('RAV4 Hybrid');
    expect(fixture.nativeElement.textContent).toContain('Model 3');
  });
});
