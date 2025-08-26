import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasIndicadoresComponent } from './compras-indicadores.component';

describe('ComprasIndicadoresComponent', () => {
  let component: ComprasIndicadoresComponent;
  let fixture: ComponentFixture<ComprasIndicadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComprasIndicadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComprasIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
