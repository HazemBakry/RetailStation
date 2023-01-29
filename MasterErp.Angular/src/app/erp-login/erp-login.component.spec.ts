import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpLoginComponent } from './erp-login.component';

describe('ErpLoginComponent', () => {
  let component: ErpLoginComponent;
  let fixture: ComponentFixture<ErpLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErpLoginComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErpLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
