import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponValidatorPageRoutingModule } from './coupon-validator-routing.module';

import { CouponValidatorPage } from './coupon-validator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponValidatorPageRoutingModule
  ],
  declarations: [CouponValidatorPage]
})
export class CouponValidatorPageModule {}
