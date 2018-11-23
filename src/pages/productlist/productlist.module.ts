import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductlistPage } from './productlist';
import { PipeModule } from "../../providers/pipe.module";

@NgModule({
  declarations: [
    ProductlistPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductlistPage),
    PipeModule
  ]
})
export class ProductlistPageModule {}
