import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLatestHomeComponent } from './design-latest-home.component';

describe('DesignLatestHomeComponent', () => {
  let component: DesignLatestHomeComponent;
  let fixture: ComponentFixture<DesignLatestHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLatestHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLatestHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
