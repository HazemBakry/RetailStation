import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErpAdminComponent } from './erp-admin.component';

describe('ErpAdminComponent', () => {
  let component: ErpAdminComponent;
  let fixture: ComponentFixture<ErpAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ErpAdminComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ErpAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
