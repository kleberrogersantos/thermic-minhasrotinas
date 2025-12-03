import { TestBed } from '@angular/core/testing';

import { ApiProtheusServiceService } from './api-protheus.service.service';

describe('ApiProtheusServiceService', () => {
  let service: ApiProtheusServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiProtheusServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
