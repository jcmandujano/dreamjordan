import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { MyPurchasesPageRoutingModule } from './my-purchases-routing.module';

import { MyPurchasesPage } from './my-purchases.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MyPurchasesPageRoutingModule
  ],
  declarations: [MyPurchasesPage]
})
export class MyPurchasesPageModule {}
