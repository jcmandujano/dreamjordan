import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { MyPurchasesPageRoutingModule } from './my-purchases-routing.module';

import { MyPurchasesPage } from './my-purchases.page';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    MyPurchasesPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [MyPurchasesPage]
})
export class MyPurchasesPageModule {}
