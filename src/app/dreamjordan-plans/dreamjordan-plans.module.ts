import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { DreamjordanPlansPageRoutingModule } from './dreamjordan-plans-routing.module';

import { DreamjordanPlansPage } from './dreamjordan-plans.page';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    DreamjordanPlansPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [DreamjordanPlansPage]
})
export class DreamjordanPlansPageModule {}
