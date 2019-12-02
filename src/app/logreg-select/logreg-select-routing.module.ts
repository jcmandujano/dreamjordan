import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LogregSelectPage } from './logreg-select.page';

const routes: Routes = [
  {
    path: '',
    component: LogregSelectPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LogregSelectPageRoutingModule {}
