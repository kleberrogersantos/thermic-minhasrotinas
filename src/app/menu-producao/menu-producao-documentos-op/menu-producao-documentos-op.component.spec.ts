import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuProducaoDocumentosOpComponent } from './menu-producao-documentos-op.component';

describe('MenuProducaoDocumentosOpComponent', () => {
  let component: MenuProducaoDocumentosOpComponent;
  let fixture: ComponentFixture<MenuProducaoDocumentosOpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuProducaoDocumentosOpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuProducaoDocumentosOpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
