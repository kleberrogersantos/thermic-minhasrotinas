import { TestBed } from '@angular/core/testing';

import { ConsultaDocumentosService } from './consulta-documentos.service';

describe('ConsultaDocumentosService', () => {
  let service: ConsultaDocumentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaDocumentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
