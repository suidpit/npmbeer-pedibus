import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRegistrationEmailComponent } from './new-registration-email.component';

describe('NewRegistrationEmailComponent', () => {
  let component: NewRegistrationEmailComponent;
  let fixture: ComponentFixture<NewRegistrationEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewRegistrationEmailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRegistrationEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
