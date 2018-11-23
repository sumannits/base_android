import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RiderMapPage } from './rider-map';

@NgModule({
  declarations: [
    RiderMapPage,
  ],
  imports: [
    IonicPageModule.forChild(RiderMapPage),
  ],
})
export class RiderMapPageModule {}
