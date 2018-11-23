import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaveCardPage } from './save-card';

@NgModule({
  declarations: [
    SaveCardPage,
  ],
  imports: [
    IonicPageModule.forChild(SaveCardPage),
  ],
})
export class SaveCardPageModule {}
