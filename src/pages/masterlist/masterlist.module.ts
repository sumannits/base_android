import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MasterlistPage } from './masterlist';

@NgModule({
  declarations: [
    MasterlistPage,
  ],
  imports: [
    IonicPageModule.forChild(MasterlistPage),
  ],
})
export class MasterlistPageModule {}
