import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CcjefComponent } from './departments/ccjef/ccjef.component';
import { SocComponent } from './departments/soc/soc.component';
import { SasComponent } from './departments/sas/sas.component';
import { SbaComponent } from './departments/sba/sba.component';
import { SedComponent } from './departments/sed/sed.component';
import { ShtmComponent } from './departments/shtm/shtm.component';
import { SnamsComponent } from './departments/snams/snams.component';
import { DistributionComponent } from './distribution.component';
import { SeaComponent } from './departments/sea/sea.component';

const routes: Routes = [
 {
  path: '', component: DistributionComponent, children: [
    {path: 'ccjef', component: CcjefComponent},
    {path: 'soc', component: SocComponent},
    {path: 'sas', component: SasComponent},
    {path: 'sba', component: SbaComponent},
    {path: 'sed', component: SedComponent},
    {path: 'shtm', component: ShtmComponent},
    {path: 'snams', component: SnamsComponent},
    {path: 'sea', component: SeaComponent},
  ]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DistributionRoutingModule { }
