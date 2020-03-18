import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core'
import { IonicModule } from '@ionic/angular';

import { CountriesPageRoutingModule } from './countries-routing.module';

import { CountriesPage } from './countries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    CountriesPageRoutingModule
  ],
  declarations: [CountriesPage]
})
export class CountriesPageModule {}
