import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { TruncatePipe,SafePipe,SortPipe } from "./application.pipe";

@NgModule({
  declarations: [
    TruncatePipe ,
    SafePipe,
    SortPipe
  ],
  imports: [
    CommonModule,
  ],
  exports:[
    TruncatePipe ,
    SafePipe,
    SortPipe,
    //ShareModule
  ]
})
export class PipeModule {}
