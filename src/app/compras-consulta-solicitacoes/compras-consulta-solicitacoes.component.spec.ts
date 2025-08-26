import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasConsultaSolicitacoesComponent } from './compras-consulta-solicitacoes.component';

describe('ComprasConsultaSolicitacoesComponent', () => {
  let component: ComprasConsultaSolicitacoesComponent;
  let fixture: ComponentFixture<ComprasConsultaSolicitacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasConsultaSolicitacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasConsultaSolicitacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
