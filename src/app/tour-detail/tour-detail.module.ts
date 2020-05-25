import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core'
import { IonicModule } from '@ionic/angular';

import { TourDetailPageRoutingModule } from './tour-detail-routing.module';

import { TourDetailPage } from './tour-detail.page';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    TourDetailPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [TourDetailPage]
})
export class TourDetailPageModule {}
