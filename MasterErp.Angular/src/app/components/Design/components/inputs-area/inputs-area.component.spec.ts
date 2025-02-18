import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputsAreaComponent } from './inputs-area.component';

describe('InputsAreaComponent', () => {
  let component: InputsAreaComponent;
  let fixture: ComponentFixture<InputsAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputsAreaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputsAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
