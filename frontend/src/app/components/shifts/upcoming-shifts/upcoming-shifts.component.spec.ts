import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingShiftsComponent } from './upcoming-shifts.component';

describe('UpcomingShiftsComponent', () => {
  let component: UpcomingShiftsComponent;
  let fixture: ComponentFixture<UpcomingShiftsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingShiftsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
