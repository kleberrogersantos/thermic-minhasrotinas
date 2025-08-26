import { TestBed } from '@angular/core/testing';

import { StatusmatriculaService } from './statusmatricula.service';

describe('StatusmatriculaService', () => {
  let service: StatusmatriculaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusmatriculaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
