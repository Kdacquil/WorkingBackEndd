import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { EvaluationComponent } from './evaluation/evaluation.component';
import { OffboardComponent } from './offboard/offboard.component';
import { OffboardingReportComponent } from './offboarding-report/offboarding-report.component';
import { OnboardComponent } from './onboard/onboard.component';
import { OnboardingReportComponent } from './onboarding-report/onboarding-report.component';


const routes: Routes = [
  {path: '', redirectTo: 'employee-info', pathMatch: 'full'},
  {path: 'onboard', component: OnboardComponent},
  {path: 'offboard', component: OffboardComponent},
  {path: 'employee-info', component: EmployeeInfoComponent},
  {path: 'onboarding-report', component: OnboardingReportComponent},
  {path: 'offboarding-report', component: OffboardingReportComponent},
  {path: 'audit-logs', component: AuditLogsComponent},
  {path: 'evaluation', component: EvaluationComponent},
  {path: 'distribution', loadChildren: () => import('./distribution/distribution.module').then(m => m.DistributionModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
