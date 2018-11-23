import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RatingListPage } from './rating-list';

@NgModule({
  declarations: [
    RatingListPage,
  ],
  imports: [
    IonicPageModule.forChild(RatingListPage),
  ],
})
export class RatingListPageModule {}
