import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuEstoqueComponent } from './menu-estoque.component';

describe('MenuEstoqueComponent', () => {
  let component: MenuEstoqueComponent;
  let fixture: ComponentFixture<MenuEstoqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuEstoqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
