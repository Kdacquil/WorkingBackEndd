import { TestBed } from '@angular/core/testing';

import { OnboardingReportService } from './onboarding-report.service';
describe('OnboardingReportService', () => {
  let service: OnboardingReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnboardingReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
