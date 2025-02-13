import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { EmployeeInfoComponent } from './layout/pages/dashboard/employee-info/employee-info.component';
import { OffboardComponent } from './layout/pages/dashboard/offboard/offboard.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './layout/pages/home/home.component';

const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule), canActivate: [AuthGuard] },
  {path: 'login', component: LoginComponent},
  { path: 'employyes', component: EmployeeInfoComponent },
  { path: 'offboard', component: OffboardComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
