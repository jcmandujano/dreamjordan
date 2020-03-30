import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';

import { FAQsPageRoutingModule } from './faqs-routing.module';

import { FAQsPage } from './faqs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    FAQsPageRoutingModule
  ],
  declarations: [FAQsPage]
})
export class FAQsPageModule {}
