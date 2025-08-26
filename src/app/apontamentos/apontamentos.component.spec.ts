import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApontamentosComponent } from './apontamentos.component';

describe('ApontamentosComponent', () => {
  let component: ApontamentosComponent;
  let fixture: ComponentFixture<ApontamentosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApontamentosComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ApontamentosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
