import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EvaluationService } from '../../../services/evaluation.service';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { DistributionComponent } from './distribution/distribution.component';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { OffboardComponent } from './offboard/offboard.component';
import { OffboardingReportComponent } from './offboarding-report/offboarding-report.component';
import { OnboardComponent } from './onboard/onboard.component';
import { OnboardingReportComponent } from './onboarding-report/onboarding-report.component';


@NgModule({
  declarations: [
    DashboardComponent,
    OnboardComponent,
    OffboardComponent,
    EmployeeInfoComponent,
    SidebarComponent,
    DistributionComponent,
    OnboardingReportComponent,
    OffboardingReportComponent,
    AuditLogsComponent,
    EvaluationComponent


  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [
    EvaluationService
  ]
})
export class DashboardModule { }
