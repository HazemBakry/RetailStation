import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignLatestHeaderComponent } from './design-latest-header.component';

describe('DesignLatestHeaderComponent', () => {
  let component: DesignLatestHeaderComponent;
  let fixture: ComponentFixture<DesignLatestHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DesignLatestHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignLatestHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
