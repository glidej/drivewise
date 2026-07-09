import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { BuyComponent } from './buy.component';

describe('BuyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuyComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the default inventory results', async () => {
    const fixture = TestBed.createComponent(BuyComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('6 mock vehicles');
    expect(compiled.textContent).toContain('RAV4 Hybrid');
    expect(compiled.querySelectorAll('.result-card').length).toBe(6);
  });

  it('filters the inventory through the mock service', async () => {
    const fixture = TestBed.createComponent(BuyComponent);
    const component = fixture.componentInstance as unknown as {
      filters: { query: string; fuelType: string; maxPrice: number };
      runSearch: () => void;
    };

    component.filters.query = 'tesla';
    component.filters.fuelType = 'Electric';
    component.filters.maxPrice = 40000;
    component.runSearch();
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('1 mock vehicles');
    expect(compiled.textContent).toContain('Model 3');
    expect(compiled.textContent).not.toContain('RAV4 Hybrid');
  });
});
