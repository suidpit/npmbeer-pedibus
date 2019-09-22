import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftConfirmationComponent } from './shift-confirmation.component';

describe('ShiftConfirmationComponent', () => {
  let component: ShiftConfirmationComponent;
  let fixture: ComponentFixture<ShiftConfirmationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShiftConfirmationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
