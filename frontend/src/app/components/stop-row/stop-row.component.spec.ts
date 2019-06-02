import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopRowComponent } from './stop-row.component';

describe('StopRowComponent', () => {
  let component: StopRowComponent;
  let fixture: ComponentFixture<StopRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
