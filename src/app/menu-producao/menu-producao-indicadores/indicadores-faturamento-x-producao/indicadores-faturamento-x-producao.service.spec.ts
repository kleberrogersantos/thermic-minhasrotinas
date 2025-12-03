import { TestBed } from '@angular/core/testing';

import { IndicadoresFaturamentoXProducaoService } from './indicadores-faturamento-x-producao.service';

describe('IndicadoresFaturamentoXProducaoService', () => {
  let service: IndicadoresFaturamentoXProducaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndicadoresFaturamentoXProducaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
