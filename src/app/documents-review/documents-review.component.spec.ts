import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsReviewComponent } from './documents-review.component';

describe('DocumentsReviewComponent', () => {
  let component: DocumentsReviewComponent;
  let fixture: ComponentFixture<DocumentsReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsReviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
