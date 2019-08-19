import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopListRowComponent } from './stop-list-row.component';

describe('StopListRowComponent', () => {
  let component: StopListRowComponent;
  let fixture: ComponentFixture<StopListRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopListRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopListRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
