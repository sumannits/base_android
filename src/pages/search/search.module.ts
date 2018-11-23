import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { PipeModule } from "../../providers/pipe.module";

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    TranslateModule.forChild(),
    PipeModule
  ],
  exports: [
    SearchPage
  ]
})
export class SearchPageModule { }
