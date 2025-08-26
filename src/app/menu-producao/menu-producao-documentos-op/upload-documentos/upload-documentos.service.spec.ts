import { TestBed } from '@angular/core/testing';

import { UploadDocumentosService } from './upload-documentos.service';

describe('UploadDocumentosService', () => {
  let service: UploadDocumentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadDocumentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
