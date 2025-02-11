import { TestBed } from '@angular/core/testing';

import { OffboardingReportService } from './offboarding-report.service';

describe('OffboardingReportService', () => {
  let service: OffboardingReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OffboardingReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
