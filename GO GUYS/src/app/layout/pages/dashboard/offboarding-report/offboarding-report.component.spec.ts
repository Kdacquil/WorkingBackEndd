import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffboardingReportComponent } from './offboarding-report.component';

describe('OffboardingReportComponent', () => {
  let component: OffboardingReportComponent;
  let fixture: ComponentFixture<OffboardingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OffboardingReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OffboardingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
