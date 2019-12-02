import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponGeneratorPage } from './coupon-generator.page';

const routes: Routes = [
  {
    path: '',
    component: CouponGeneratorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponGeneratorPageRoutingModule {}
