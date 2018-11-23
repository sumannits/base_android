import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CateSearchPage } from './cate-search';

@NgModule({
  declarations: [
    CateSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(CateSearchPage),
  ],
})
export class CateSearchPageModule {}
