import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponValidatorPage } from './coupon-validator.page';

const routes: Routes = [
  {
    path: '',
    component: CouponValidatorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponValidatorPageRoutingModule {}
