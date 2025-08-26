import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RastreabilidadeOpVinculoDocumentoComponent } from './rastreabilidade-op-vinculo-documento.component';

describe('RastreabilidadeOpVinculoDocumentoComponent', () => {
  let component: RastreabilidadeOpVinculoDocumentoComponent;
  let fixture: ComponentFixture<RastreabilidadeOpVinculoDocumentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RastreabilidadeOpVinculoDocumentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RastreabilidadeOpVinculoDocumentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
