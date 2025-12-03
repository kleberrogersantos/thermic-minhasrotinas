import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProducaoIndicadoresComponent } from './menu-producao-indicadores.component';

describe('MenuProducaoIndicadoresComponent', () => {
  let component: MenuProducaoIndicadoresComponent;
  let fixture: ComponentFixture<MenuProducaoIndicadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuProducaoIndicadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuProducaoIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
