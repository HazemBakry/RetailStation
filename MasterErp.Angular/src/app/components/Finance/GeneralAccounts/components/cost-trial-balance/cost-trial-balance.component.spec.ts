import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostTrialBalanceComponent } from './cost-trial-balance.component';

describe('CostTrialBalanceComponent', () => {
  let component: CostTrialBalanceComponent;
  let fixture: ComponentFixture<CostTrialBalanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CostTrialBalanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CostTrialBalanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
