import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DistributionRoutingModule } from './distribution-routing.module';
import { CcjefComponent } from './departments/ccjef/ccjef.component';
import { SasComponent } from './departments/sas/sas.component';
import { SbaComponent } from './departments/sba/sba.component';
import { SeaComponent } from './departments/sea/sea.component';
import { SedComponent } from './departments/sed/sed.component';
import { ShtmComponent } from './departments/shtm/shtm.component';
import { SnamsComponent } from './departments/snams/snams.component';
import { SocComponent } from './departments/soc/soc.component';


@NgModule({
  declarations: [
    CcjefComponent,
    SasComponent,
    SbaComponent,
    SeaComponent,
    SedComponent,
    ShtmComponent,
    SnamsComponent,
    SocComponent
  ],
  imports: [
    CommonModule,
    DistributionRoutingModule
  ]
})
export class DistributionModule { }
