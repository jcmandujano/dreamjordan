import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DreamjordanDetailPageRoutingModule } from './dreamjordan-detail-routing.module';

import { DreamjordanDetailPage } from './dreamjordan-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DreamjordanDetailPageRoutingModule
  ],
  declarations: [DreamjordanDetailPage]
})
export class DreamjordanDetailPageModule {}
