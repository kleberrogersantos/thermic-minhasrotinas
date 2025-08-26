import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RastreabilidadeOPComponent } from './rastreabilidade-op.component';

describe('RastreabilidadeOPComponent', () => {
  let component: RastreabilidadeOPComponent;
  let fixture: ComponentFixture<RastreabilidadeOPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RastreabilidadeOPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RastreabilidadeOPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
