import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestDownloadPageRoutingModule } from './test-download-routing.module';

import { TestDownloadPage } from './test-download.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestDownloadPageRoutingModule
  ],
  declarations: [TestDownloadPage]
})
export class TestDownloadPageModule {}
