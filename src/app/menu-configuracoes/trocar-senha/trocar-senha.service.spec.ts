import { TestBed } from '@angular/core/testing';

import { TrocarSenhaService } from './trocar-senha.service';

describe('TrocarSenhaService', () => {
  let service: TrocarSenhaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrocarSenhaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
