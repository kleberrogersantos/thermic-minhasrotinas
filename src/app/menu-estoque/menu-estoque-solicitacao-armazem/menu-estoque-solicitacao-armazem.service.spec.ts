import { TestBed } from '@angular/core/testing';

import { MenuEstoqueSolicitacaoArmazemService } from './menu-estoque-solicitacao-armazem.service';

describe('MenuEstoqueSolicitacaoArmazemService', () => {
  let service: MenuEstoqueSolicitacaoArmazemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuEstoqueSolicitacaoArmazemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
