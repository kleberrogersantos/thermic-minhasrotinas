import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RastreabilidadeOpVinculoClienteComponent } from './rastreabilidade-op-vinculo-cliente.component';

describe('RastreabilidadeOpVinculoClienteComponent', () => {
  let component: RastreabilidadeOpVinculoClienteComponent;
  let fixture: ComponentFixture<RastreabilidadeOpVinculoClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RastreabilidadeOpVinculoClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RastreabilidadeOpVinculoClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
