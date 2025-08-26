import { TestBed } from '@angular/core/testing';

import { ApiDocumentsreviewService } from './api-documentsreview.service';

describe('ApiDocumentsreviewService', () => {
  let service: ApiDocumentsreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiDocumentsreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
