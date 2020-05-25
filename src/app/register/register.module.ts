import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { RegisterPageRoutingModule } from './register-routing.module';

import { RegisterPage } from './register.page';
import { SharedModuleModule } from '../shared-module/shared-module.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,TranslateModule,
    ReactiveFormsModule,
    IonicModule,
    RegisterPageRoutingModule,
    SharedModuleModule
  ],
  declarations: [RegisterPage]
})
export class RegisterPageModule {}
