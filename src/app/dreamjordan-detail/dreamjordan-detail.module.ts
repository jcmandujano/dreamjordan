import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';

import { DreamjordanDetailPageRoutingModule } from './dreamjordan-detail-routing.module';

import { DreamjordanDetailPage } from './dreamjordan-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    DreamjordanDetailPageRoutingModule
  ],
  declarations: [DreamjordanDetailPage]
})
export class DreamjordanDetailPageModule {}
