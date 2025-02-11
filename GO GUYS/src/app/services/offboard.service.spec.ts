import { TestBed } from '@angular/core/testing';

import { OffboardService } from './offboard.service';

describe('OffboardService', () => {
  let service: OffboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
