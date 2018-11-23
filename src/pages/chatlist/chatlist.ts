import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Api, ResponseMessage } from '../../providers';
import * as _ from 'lodash';

/**
 * Generated class for the ChatlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatlist',
  templateUrl: 'chatlist.html',
})
export class ChatlistPage {

  public loginUserId:any;
  public loginUserDet:any;
  public chatlist = [];
  public dbRef: any;
  public frmdbRef: any;
  public myRoomIdlist = [];

  constructor(
    public navCtrl: NavController, 
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    public serviceApi: Api,
    public navParams: NavParams
  ) {
    let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      let userDetailsJson:any = localStorage.getItem('userPrfDet');
      userDetailsJson = JSON.parse(userDetailsJson);
      this.loginUserId = userDetailsJson.id;
      this.loginUserDet = userDetailsJson;
    }
  }

  ionViewDidLoad() {
    this.getMyChatMessages();
  }

  getMyChatMessages() {
    this.serviceApi.postData({"user_id": this.loginUserId, "type":this.loginUserDet.user_type},'users/get_mychat_list').then((result:any) => {
      if(result.Ack == 1){
        //console.log(result.room_list);
        if(result.room_list.length >0){
          result.room_list.forEach(element => {
            if(element.id >0){
              this.getLastMsg(element.id, element);
              //this.myRoomIdlist.push(element.id);
            }
          });
        }
      }
    }, (err) => {
    
    }); 
    
    //console.log(this.chatlist);
  }

  public getLastMsg(nRoomId:any, userData:any){
    const messages1 = this.db.collection('livechat', ref => { 
      return ref.where('room_id', '==', nRoomId).orderBy('cdate', 'desc').limit(1);
    }).snapshotChanges().map(actions => { 
      return actions.map(action => { 
        const data1 = action.payload.doc.data();
        const id = action.payload.doc.id;
        return { id, ...data1 };
      });
    });

    messages1.subscribe(data => {  
      if(data.length>0){
        let msgData:any = data[0];
        //console.log(msgData.to_user_id); 
        if(msgData.to_user_id==this.loginUserId){
          msgData.first_name =userData.first_name;
          msgData.last_name =userData.last_name;
          msgData.image_url =userData.image_url;
        }else{
          msgData.first_name =this.loginUserDet.first_name;
          msgData.last_name =this.loginUserDet.last_name;
          msgData.image_url =this.loginUserDet.image_url;
        }
        this.chatlist.push(msgData); 
      } 
    });
  }
  gotoChatDet(ordId){
    this.navCtrl.push('ChatdetailsPage',{'ordDet_id':ordId})
  }
}
