import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionDocumentsComponent } from './production-documents.component';

describe('ProductionDocumentsComponent', () => {
  let component: ProductionDocumentsComponent;
  let fixture: ComponentFixture<ProductionDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductionDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
