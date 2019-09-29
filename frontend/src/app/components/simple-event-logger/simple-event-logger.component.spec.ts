import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleEventLoggerComponent } from './simple-event-logger.component';

describe('SimpleEventLoggerComponent', () => {
  let component: SimpleEventLoggerComponent;
  let fixture: ComponentFixture<SimpleEventLoggerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleEventLoggerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleEventLoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
