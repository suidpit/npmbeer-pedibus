import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftAvailabilitiesComponent } from './shift-availabilities.component';

describe('ShiftAvailabilitiesComponent', () => {
  let component: ShiftAvailabilitiesComponent;
  let fixture: ComponentFixture<ShiftAvailabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftAvailabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftAvailabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
