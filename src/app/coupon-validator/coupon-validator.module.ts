import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponValidatorPageRoutingModule } from './coupon-validator-routing.module';

import { CouponValidatorPage } from './coupon-validator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    CouponValidatorPageRoutingModule
  ],
  declarations: [CouponValidatorPage]
})
export class CouponValidatorPageModule {}
