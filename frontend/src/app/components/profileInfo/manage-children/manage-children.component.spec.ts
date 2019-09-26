import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageChildrenComponent } from './manage-children.component';

describe('ManageChildrenComponent', () => {
  let component: ManageChildrenComponent;
  let fixture: ComponentFixture<ManageChildrenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageChildrenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
