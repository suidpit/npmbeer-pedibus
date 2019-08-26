import { TestBed } from '@angular/core/testing';

import { StopService } from './stop.service';

describe('StopService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StopService = TestBed.get(StopService);
    expect(service).toBeTruthy();
  });
});
