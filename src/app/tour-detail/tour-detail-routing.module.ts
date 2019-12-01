import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TourDetailPage } from './tour-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TourDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TourDetailPageRoutingModule {}
