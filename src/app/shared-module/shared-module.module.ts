import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { IonicModule } from '@ionic/angular';



@NgModule({
  declarations: [ToolbarComponent],
  exports: [ToolbarComponent],
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class SharedModuleModule { }
