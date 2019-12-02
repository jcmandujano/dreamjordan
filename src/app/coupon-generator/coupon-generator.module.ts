import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponGeneratorPageRoutingModule } from './coupon-generator-routing.module';

import { CouponGeneratorPage } from './coupon-generator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponGeneratorPageRoutingModule
  ],
  declarations: [CouponGeneratorPage]
})
export class CouponGeneratorPageModule {}
