import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackDetailsPage } from './track-details';

@NgModule({
  declarations: [
    TrackDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackDetailsPage),
  ],
})
export class TrackDetailsPageModule {}
