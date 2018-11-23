import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController,AlertController,LoadingController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
/**
 * Generated class for the MasterlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-masterlist',
  templateUrl: 'masterlist.html',
})
export class MasterlistPage {

  public masterCatData = [];
  public orderAMData = [];
  public orderPMData = [];
  public orderTotData = [];
  public dateselect:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public toastCtrl:ToastController, 
    public alertCtrl:AlertController,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
      this.getMasterdata();
  }

  getMasterdata(){
    let loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    loading.present();

    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    let todayDate = new Date().toJSON().split('T')[0];
    this.dateselect=todayDate;
    //let todayDate: String = new Date().toISOString();
    //console.log(todayDate);
    this.serviceApi.postData({"user_id": loguser.id,"delivery_date":todayDate},'users/rider_master_list').then((result:any) => {
    //console.log(result);
      if(result.Ack == 1){
          this.masterCatData = result.cat_list;
          this.orderAMData = result.order_am;
          this.orderPMData = result.order_pm;
          this.orderTotData = result.order_total;
          loading.dismiss();
      }else{
        loading.dismiss();
      }
      
    }, (err) => {
      loading.dismiss();
    });
  }

  dateChanged(){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
      let selDate=this.dateselect;
      //console.log(selDate);
      let loading = this.loadingCtrl.create({
        content: 'Please Wait...'
      });
      loading.present();
      this.serviceApi.postData({"user_id": loguser.id,"delivery_date":selDate},'users/rider_master_list').then((result:any) => {
        //console.log(result);
          if(result.Ack == 1){
              this.masterCatData = result.cat_list;
              this.orderAMData = result.order_am;
              this.orderPMData = result.order_pm;
              this.orderTotData = result.order_total;
              //console.log(this.masterCatData);
              loading.dismiss();
          }else{
            loading.dismiss();
          }
          
        }, (err) => {
          loading.dismiss();
      });
  }
}
