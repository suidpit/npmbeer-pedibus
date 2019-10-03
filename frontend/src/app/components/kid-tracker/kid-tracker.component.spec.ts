import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KidTrackerComponent } from './kid-tracker.component';

describe('KidTrackerComponent', () => {
  let component: KidTrackerComponent;
  let fixture: ComponentFixture<KidTrackerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KidTrackerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KidTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
