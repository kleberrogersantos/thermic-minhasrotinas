import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComprasComponent } from './menu-compras.component';

describe('MenuComprasComponent', () => {
  let component: MenuComprasComponent;
  let fixture: ComponentFixture<MenuComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
