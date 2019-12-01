import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DreamjordanPlansPage } from './dreamjordan-plans.page';

const routes: Routes = [
  {
    path: '',
    component: DreamjordanPlansPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DreamjordanPlansPageRoutingModule {}
