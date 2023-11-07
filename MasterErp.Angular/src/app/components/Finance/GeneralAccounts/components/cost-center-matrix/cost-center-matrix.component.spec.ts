import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostCenterMatrixComponent } from './cost-center-matrix.component';

describe('CostCenterMatrixComponent', () => {
  let component: CostCenterMatrixComponent;
  let fixture: ComponentFixture<CostCenterMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostCenterMatrixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostCenterMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
