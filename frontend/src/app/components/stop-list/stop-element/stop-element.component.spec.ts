import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopElementComponent } from './stop-element.component';

describe('StopElementComponent', () => {
  let component: StopElementComponent;
  let fixture: ComponentFixture<StopElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
