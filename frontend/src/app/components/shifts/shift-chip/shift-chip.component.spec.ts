import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftChipComponent } from './shift-chip.component';

describe('ShiftChipComponent', () => {
  let component: ShiftChipComponent;
  let fixture: ComponentFixture<ShiftChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
