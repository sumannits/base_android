import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalOtpPage } from './modal-otp';

@NgModule({
  declarations: [
    ModalOtpPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalOtpPage),
  ],
})
export class ModalOtpPageModule {}
