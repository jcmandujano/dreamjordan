import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { MyCartPageRoutingModule } from './my-cart-routing.module';

import { MyCartPage } from './my-cart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TranslateModule,
    MyCartPageRoutingModule
  ],
  declarations: [MyCartPage]
})
export class MyCartPageModule {}
