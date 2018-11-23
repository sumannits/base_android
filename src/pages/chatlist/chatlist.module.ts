import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatlistPage } from './chatlist';
import { PipeModule } from "../../providers/pipe.module";

@NgModule({
  declarations: [
    ChatlistPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatlistPage),
    PipeModule
  ],
})
export class ChatlistPageModule {}
