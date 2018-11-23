import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalStatusPage } from './modal-status';

@NgModule({
  declarations: [
    ModalStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalStatusPage),
  ],
})
export class ModalStatusPageModule {}
