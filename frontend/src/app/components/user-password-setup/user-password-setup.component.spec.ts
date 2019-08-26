import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPasswordSetupComponent } from './user-password-setup.component';

describe('UserPasswordSetupComponent', () => {
  let component: UserPasswordSetupComponent;
  let fixture: ComponentFixture<UserPasswordSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPasswordSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPasswordSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
