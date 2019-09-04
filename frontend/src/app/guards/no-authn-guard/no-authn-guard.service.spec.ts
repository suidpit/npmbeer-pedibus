import { TestBed } from '@angular/core/testing';

import { NoAuthnGuardService } from './no-authn-guard.service';

describe('NoAuthnGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NoAuthnGuardService = TestBed.get(NoAuthnGuardService);
    expect(service).toBeTruthy();
  });
});
