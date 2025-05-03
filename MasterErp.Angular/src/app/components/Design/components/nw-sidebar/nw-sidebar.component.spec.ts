import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NwSidebarComponent } from './nw-sidebar.component';

describe('NwSidebarComponent', () => {
  let component: NwSidebarComponent;
  let fixture: ComponentFixture<NwSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NwSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NwSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
