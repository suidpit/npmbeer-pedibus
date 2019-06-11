import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProveComponent } from './prove.component';

describe('ProveComponent', () => {
  let component: ProveComponent;
  let fixture: ComponentFixture<ProveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
