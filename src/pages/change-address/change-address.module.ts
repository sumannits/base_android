import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeAddressPage } from './change-address';

@NgModule({
  declarations: [
    ChangeAddressPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeAddressPage),
  ],
})
export class ChangeAddressPageModule {}
