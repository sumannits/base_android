import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the RiderPackedorderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rider-packedorder',
  templateUrl: 'rider-packedorder.html',
})
export class RiderPackedorderPage {
  public orderdetail= [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api
  ) {
  }

  ionViewDidLoad() {
    this.getOrdList();
  }

  getOrdList(){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    this.serviceApi.postData({"user_id": loguser.id,"type":"P"},'users/rider_assign_orderlist').then((result:any) => { 
      if(result.Ack == 1){
        this.orderdetail = result.order_list;
      }
      
    }, (err) => {
    });
  }

  goToDetails(id){
      this.navCtrl.push("MyOrderDetailPage",{'order_id':id});
  }
}
