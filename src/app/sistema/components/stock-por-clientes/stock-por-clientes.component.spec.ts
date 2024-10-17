import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockPorClientesComponent } from './stock-por-clientes.component';

describe('StockPorClientesComponent', () => {
  let component: StockPorClientesComponent;
  let fixture: ComponentFixture<StockPorClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockPorClientesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockPorClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
