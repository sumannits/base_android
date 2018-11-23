import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubCatePage } from './sub-cate';

@NgModule({
  declarations: [
    SubCatePage,
  ],
  imports: [
    IonicPageModule.forChild(SubCatePage),
  ],
})
export class SubCatePageModule {}
