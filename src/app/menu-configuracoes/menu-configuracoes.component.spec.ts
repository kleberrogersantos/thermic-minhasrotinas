import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuConfiguracoesComponent } from './menu-configuracoes.component';

describe('MenuConfiguracoesComponent', () => {
  let component: MenuConfiguracoesComponent;
  let fixture: ComponentFixture<MenuConfiguracoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuConfiguracoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuConfiguracoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
