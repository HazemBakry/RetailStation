import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NwHeaderComponent } from './nw-header.component';

describe('NwHeaderComponent', () => {
  let component: NwHeaderComponent;
  let fixture: ComponentFixture<NwHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NwHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NwHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
