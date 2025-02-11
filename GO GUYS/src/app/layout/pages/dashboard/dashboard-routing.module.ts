import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OnboardComponent } from './onboard/onboard.component';
import { OffboardComponent } from './offboard/offboard.component';
import { EmployeeInfoComponent } from './employee-info/employee-info.component';
import { DistributionComponent } from './distribution/distribution.component';
import { OnboardingReportComponent } from './onboarding-report/onboarding-report.component';
import { OffboardingReportComponent } from './offboarding-report/offboarding-report.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';


const routes: Routes = [
  {path: '', redirectTo: 'distribution', pathMatch: 'full'},
  {path: 'onboard', component: OnboardComponent},
  {path: 'offboard', component: OffboardComponent},
  {path: 'employee-info', component: EmployeeInfoComponent},
  {path: 'onboarding-report', component: OnboardingReportComponent},
  {path: 'offboarding-report', component: OffboardingReportComponent},
  {path: 'audit-logs', component: AuditLogsComponent},
  {path: 'distribution', loadChildren: () => import('./distribution/distribution.module').then(m => m.DistributionModule)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
