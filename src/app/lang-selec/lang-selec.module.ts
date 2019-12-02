import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LangSelecPageRoutingModule } from './lang-selec-routing.module';

import { LangSelecPage } from './lang-selec.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LangSelecPageRoutingModule
  ],
  declarations: [LangSelecPage]
})
export class LangSelecPageModule {}
