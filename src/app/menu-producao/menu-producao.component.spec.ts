import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProducaoComponent } from './menu-producao.component';

describe('MenuProducaoComponent', () => {
  let component: MenuProducaoComponent;
  let fixture: ComponentFixture<MenuProducaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuProducaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuProducaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
