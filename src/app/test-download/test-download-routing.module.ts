import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestDownloadPage } from './test-download.page';

const routes: Routes = [
  {
    path: '',
    component: TestDownloadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestDownloadPageRoutingModule {}
