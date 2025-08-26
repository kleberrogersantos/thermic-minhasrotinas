import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEstoqueSolicitacaoArmazemComponent } from './menu-estoque-solicitacao-armazem.component';

describe('MenuEstoqueSolicitacaoArmazemComponent', () => {
  let component: MenuEstoqueSolicitacaoArmazemComponent;
  let fixture: ComponentFixture<MenuEstoqueSolicitacaoArmazemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEstoqueSolicitacaoArmazemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEstoqueSolicitacaoArmazemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
