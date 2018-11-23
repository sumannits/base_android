import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomOrderPage } from './custom-order';

@NgModule({
  declarations: [
    CustomOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomOrderPage),
  ],
})
export class CustomOrderPageModule {}
