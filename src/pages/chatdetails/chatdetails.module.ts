import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatdetailsPage } from './chatdetails';
//import { AngularFireDatabaseModule } from 'angularfire2/database';

@NgModule({
  declarations: [
    ChatdetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatdetailsPage),
    //AngularFireDatabaseModule
  ],
})
export class ChatdetailsPageModule {}
