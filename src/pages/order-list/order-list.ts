import { Component } from '@angular/core';
import { Api, ResponseMessage } from '../../providers';
import { IonicPage, NavController, NavParams, AlertController, LoadingController,ToastController } from 'ionic-angular';
/**
 * Generated class for the OrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {
  public getresult:any;
  public orderdetail:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public toastCtrl:ToastController, public loadingCtrl: LoadingController,public alertCtrl: AlertController,public serviceApi: Api) {
  }

  ionViewDidLoad() {
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    // this.usertype=loguser.utype
     this.serviceApi.postData({"user_id": loguser.id},'users/orderlist').then((result) => { 
       //console.log(result);
       this.getresult = result;
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

  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
    }

  goToDetails(id){
    this.navCtrl.push("OrderDetailPage",{'order_id':id});
  }

  gotoChatDet(ordId){
    this.navCtrl.push('ChatdetailsPage',{'ordDet_id':ordId})
  }

}
