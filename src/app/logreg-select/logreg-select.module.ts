import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LogregSelectPageRoutingModule } from './logreg-select-routing.module';

import { LogregSelectPage } from './logreg-select.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LogregSelectPageRoutingModule
  ],
  declarations: [LogregSelectPage]
})
export class LogregSelectPageModule {}
