import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LangSelecPage } from './lang-selec.page';

const routes: Routes = [
  {
    path: '',
    component: LangSelecPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LangSelecPageRoutingModule {}
