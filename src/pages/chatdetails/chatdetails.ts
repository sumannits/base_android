import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Content } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { Api, ResponseMessage } from '../../providers';
/**
 * Generated class for the ChatdetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chatdetails',
  templateUrl: 'chatdetails.html',
  queries: {
      content: new ViewChild(Content)
  }
})
export class ChatdetailsPage {
  @ViewChild(Content) content: Content;

  public chatlist = [];
  public dbRef: any;
  public room_id: string;
  public loginUserId:any;
  public loginUserDet:any;
  public message:string = '';
  public ordDetData:any;
  public toUserId:number = 0;
  public toUserDet:any;

  constructor(
    public navCtrl: NavController, 
    public db: AngularFirestore,
    public alertCtrl: AlertController,
    public serviceApi: Api,
    public navParams: NavParams
  ) {
    //this.room_id = '100_10';
    this.room_id = this.navParams.get('ordDet_id');
    let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      let userDetailsJson:any = localStorage.getItem('userPrfDet');
      userDetailsJson = JSON.parse(userDetailsJson);
      this.loginUserId = userDetailsJson.id;
      this.loginUserDet = userDetailsJson;
    }
    this.getMessages();
  }

  getOrdDet(){
    this.serviceApi.postData({"details_id": this.room_id },'users/orderdetails').then((result:any) => { //console.log(result);
      if(result.Ack == 1) {
        if(this.loginUserId == result.order_details[0].user_id){
          this.toUserId = result.order_details[0].shop_id;
        }else{
          this.toUserId = result.order_details[0].user_id;
        }
        this.serviceApi.postData({"id": this.toUserId },'users/appuserdetails').then((result:any) => {
          this.toUserDet = result.UserDetails[0];
        }, (err) => {
          
        });  
      }
    }, (err) => {
     
    });
  }

  ionViewDidLoad() {
    this.getOrdDet();
  }

  getMessages() {
    this.dbRef = this.db.collection('livechat', ref => {
      return ref.where('room_id', '==', this.room_id).orderBy("cdate", "asc");
    }).snapshotChanges().map(actions => {
      return actions.map(action => {
        const data = action.payload.doc.data();
        const id = action.payload.doc.id;
        if (data.to_user_id == this.loginUserId) {
          setTimeout(() => {
            this.db.collection('livechat').doc(id).update({ to_is_read: true }).then(res => {
              
            }).catch(err => {
              
            });
          }, 3000);
        }
        return { id, ...data };
      });
    });
    this.dbRef.subscribe(data => {
      this.chatlist = data;
      //console.log(data);
      this.updateUserOfMessages();
    });
    // setTimeout(() => {
    //   // if(this.offStatus === false) {
        
    //   // }
      
    // }, 1000);
  }

  updateUserOfMessages() {
    this.chatlist.map(chat => {
      if (chat.from_user_id === this.loginUserId) {
        chat.isSelf = true;
        chat.cssClass = "chating-area-b";
      } else {
        chat.isSelf = false;
        chat.cssClass = "chating-area";
      }
    });
    this.scrollToBottom();
  }

  sendMessage(data:string){
    if(data.trim()==''){
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Please type your message' ,
        buttons: ['Ok']
      });
      alert.present();
    }else{
      const data = {
        room_id: this.room_id,
        from_is_read: true,
        from_user_id: this.loginUserId,
        to_is_read: false,
        to_user_id: this.toUserId,
        cdate: firebase.firestore.FieldValue.serverTimestamp(),
        message: {
          text: this.message
        }
      };
      //console.log(data);
      this.db.collection('livechat').add(data).then(res => {
        this.message = '';
        this.scrollToBottom();
        //this.getMessages();
      }).catch(err => {
        //console.log('error with fb: ', err);
      });
    }   
  }

  scrollToBottom(){
    setTimeout(() => {
      this.content.scrollToBottom(300);
    }, 200);
  }
}
