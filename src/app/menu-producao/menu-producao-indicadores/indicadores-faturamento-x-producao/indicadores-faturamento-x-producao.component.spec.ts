import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicadoresFaturamentoXProducaoComponent } from './indicadores-faturamento-x-producao.component';

describe('IndicadoresFaturamentoXProducaoComponent', () => {
  let component: IndicadoresFaturamentoXProducaoComponent;
  let fixture: ComponentFixture<IndicadoresFaturamentoXProducaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndicadoresFaturamentoXProducaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndicadoresFaturamentoXProducaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
