import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core'
import { IonicModule } from '@ionic/angular';

import { CountryDetailPageRoutingModule } from './country-detail-routing.module';

import { CountryDetailPage } from './country-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    CountryDetailPageRoutingModule
  ],
  declarations: [CountryDetailPage]
})
export class CountryDetailPageModule {}
