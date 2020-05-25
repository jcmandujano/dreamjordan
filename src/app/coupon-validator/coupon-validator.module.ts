import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { CouponValidatorPageRoutingModule } from './coupon-validator-routing.module';

import { CouponValidatorPage } from './coupon-validator.page';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    CouponValidatorPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [CouponValidatorPage]
})
export class CouponValidatorPageModule {}
