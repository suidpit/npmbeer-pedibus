import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpostaPasswordComponent } from './imposta-password.component';

describe('ImpostaPasswordComponent', () => {
  let component: ImpostaPasswordComponent;
  let fixture: ComponentFixture<ImpostaPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpostaPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpostaPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
