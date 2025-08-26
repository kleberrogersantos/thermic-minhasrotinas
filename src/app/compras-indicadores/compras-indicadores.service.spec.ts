import { TestBed } from '@angular/core/testing';

import { ComprasIndicadoresService } from './compras-indicadores.service';

describe('ComprasIndicadoresService', () => {
  let service: ComprasIndicadoresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprasIndicadoresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
