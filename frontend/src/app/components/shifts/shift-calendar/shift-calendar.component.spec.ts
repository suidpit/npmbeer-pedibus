import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftCalendarComponent } from './shift-calendar.component';

describe('ShiftCalendarComponent', () => {
  let component: ShiftCalendarComponent;
  let fixture: ComponentFixture<ShiftCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
