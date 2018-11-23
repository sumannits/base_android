import { Component } from '@angular/core';
import { Api, ResponseMessage } from '../../providers';
import { IonicPage, NavController, NavParams, AlertController, LoadingController,ToastController } from 'ionic-angular';
import {MyApp} from '../../app/app.component';
/**
 * Generated class for the MyOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-order',
  templateUrl: 'my-order.html',
})
export class MyOrderPage {

  public getresult:any;
  public orderdetail:any;

  constructor(public navCtrl: NavController, public myApp:MyApp, public navParams: NavParams,public serviceApi: Api,public toastCtrl:ToastController) {
  }

  ionViewDidLoad() {
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    // this.usertype=loguser.utype
     this.serviceApi.postData({"user_id": loguser.id,"type":"U"},'users/rider_assign_orderlist').then((result) => { 
       this.getresult = result;
       //console.log("LISTTT",this.getresult);
       if(this.getresult.Ack == 1)
       {
        
         this.orderdetail = this.getresult.order_list;
       }
       else{
         this.tost_message('No Detail Found')
       }
       
     }, (err) => {
       //console.log(err);
       this.tost_message('No Detail Found')
     });

     this.myApp.menuOpened();
  }
  
  gotoChatDet(ordId){
    this.navCtrl.push('ChatdetailsPage',{'ordDet_id':ordId})
  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
    }

    goToDetails(id){
      this.navCtrl.push("MyOrderDetailPage",{'order_id':id});
    }

}
