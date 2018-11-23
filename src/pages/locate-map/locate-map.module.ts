import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocateMapPage } from './locate-map';

@NgModule({
  declarations: [
    LocateMapPage,
  ],
  imports: [
    IonicPageModule.forChild(LocateMapPage),
  ],
})
export class LocateMapPageModule {}
