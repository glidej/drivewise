import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LearnComponent } from './learn.component';

describe('LearnComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearnComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the learning positioning and estimator', async () => {
    const fixture = TestBed.createComponent(LearnComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Get ready to buy');
    expect(compiled.textContent).toContain('$547/mo');
    expect(compiled.textContent).toContain('Shop with context');
  });

  it('renders guide and buyer path data from the learning service', async () => {
    const fixture = TestBed.createComponent(LearnComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelectorAll('.guide-card').length).toBe(4);
    expect(compiled.textContent).toContain('Budget like a buyer');
    expect(compiled.textContent).toContain('Validate the details');
  });
});
