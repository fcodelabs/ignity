import { TestBed } from '@angular/core/testing';

import { FireConnectionService } from './fire-connection.service';

describe('FireConnectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FireConnectionService = TestBed.get(FireConnectionService);
    expect(service).toBeTruthy();
  });
});
