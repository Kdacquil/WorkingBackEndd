import { TestBed } from '@angular/core/testing';

import { OffboardReportService } from './offboard-report.service';

describe('OffboardReportService', () => {
  let service: OffboardReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffboardReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
