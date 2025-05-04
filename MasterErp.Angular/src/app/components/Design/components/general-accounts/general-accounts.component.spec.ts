import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralAccountsComponent } from './general-accounts.component';

describe('GeneralAccountsComponent', () => {
  let component: GeneralAccountsComponent;
  let fixture: ComponentFixture<GeneralAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
