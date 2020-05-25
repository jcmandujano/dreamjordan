import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { SharedModuleModule } from '../shared-module/shared-module.module';
 
const SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

import { HomePage } from './home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwiperModule,
    TranslateModule,
    SwiperModule.forRoot(SWIPER_CONFIG),
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ]),
    SharedModuleModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
