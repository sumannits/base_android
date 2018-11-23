import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the RatingListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rating-list',
  templateUrl: 'rating-list.html',
})
export class RatingListPage {
  public orderId:any;
  public ratList = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public serviceApi: Api) {
    this.orderId=this.navParams.get('ord_id');
    //console.log(this.orderId);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad RatingListPage');
    this.getMyRatList();
  }

  getMyRatList(){
     this.serviceApi.postData({"order_id": this.orderId},'users/ratting_list').then((result:any) => {   
      //console.log(result);
      if(result.Ack == 1) {
        this.ratList = result.ratting_list;
      } 
    },
    (err) => {
    });    
  }

}
