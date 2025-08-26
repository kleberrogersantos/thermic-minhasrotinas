import { TestBed } from '@angular/core/testing';

import { ApiProtheusService } from './api-protheus.service';

describe('ApiProtheusService', () => {
  let service: ApiProtheusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiProtheusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
