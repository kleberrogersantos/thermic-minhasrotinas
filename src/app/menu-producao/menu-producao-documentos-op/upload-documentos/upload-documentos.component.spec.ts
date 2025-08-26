import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDocumentosComponent } from './upload-documentos.component';

describe('UploadDocumentosComponent', () => {
  let component: UploadDocumentosComponent;
  let fixture: ComponentFixture<UploadDocumentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadDocumentosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadDocumentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
