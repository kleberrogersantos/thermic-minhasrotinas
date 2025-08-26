import { TestBed } from '@angular/core/testing';

import { ApontamentosService } from './apontamentos.service';

describe('ApontamentosService', () => {
  let service: ApontamentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApontamentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
