import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,AlertController,LoadingController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { Ionic2RatingModule } from 'ionic2-rating';
/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {
  public DeliveryCharge:number = 25.00;
  public order:any;
  public getresult:any;
  public ordershow:any;
  public orderid:any;
  public orderdt:any;
  public orderzip:any;
  public ordername:any;
  public orderamount:any;
  public orderviewid:any;
  public shopaddress:any;
  public modelname:any;
  public repaircatname:any;
  public storename:any;
  public productquantity:any;
  public productshippingcost:any;
  public subtotal:any;
  public grandtotal:any;
  public productprice:any;
  public paymenttype:any;
  public type:any;
  public shipmentdetails:any;
  public shipmentzip:any;
  public landmark:any;
  public destination:any;
  public mobno:any;
  public sevtax:any;
  public deliverydate:any;
  public status:any;
  public buttonchange:number = 0;
  public button:any;
//  private range:Array<number> = [1,2,3,4,5];
  public rate:any;
  public review:any;
  responseData : any;
  public isjobdone:any;
  public loadingConst:any;
  public myAddressLat:any;
  public myAddressLong:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl:AlertController,public serviceApi: Api,
    public loadingCtrl: LoadingController,
    public toastCtrl:ToastController) {
  
  this.DeliveryCharge=25.00
  }

  ionViewDidLoad() {
    
    this.order=this.navParams.get('order_id');
    this.getOrderDet();
  }

  getOrderDet(){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    let paramval={
      "details_id": this.order
     };
    this.serviceApi.postData(paramval,'users/orderdetails').then((result:any) => { 
      console.log("rsultttttttttttt",result);
     if(result.Ack == 1){
        this.getresult = result;
        this.status=this.getresult.order_details[0].order_status;
        this.deliverydate=this.getresult.order_sub_details[0].delivery_date;

        this.getresult.order_details[0].total_amount=parseFloat(this.getresult.order_details[0].total_amount)+parseFloat(this.getresult.order_details[0].due_amt);
        //console.log("this.deliverydate", this.deliverydate);
        this.ordershow = this.getresult.order_details;

        this.sevtax=this.getresult.order_details[0].service_charge;
        this.mobno=this.getresult.shipping_details[0].phone;
        this.destination=this.getresult.shipping_details[0].save_as;
        this.shipmentdetails=this.getresult.shipping_details[0].address;
        this.shipmentzip=this.getresult.shipping_details[0].zip;
        this.landmark=this.getresult.shipping_details[0].landmark;
        this.myAddressLat = this.getresult.shipping_details[0].lati;
        this.myAddressLong = this.getresult.shipping_details[0].logni;
        if(this.paymenttype==3){
          this.type=0;
        }else{
          this.type=1
        }
      
     }else{
        this.tost_message('No Detail Found')
       }
      
    }, (err) => {
      
    });

    this.serviceApi.postData({"order_id": this.order,"user_id":loguser.id},'users/check_ratting').then((result:any) => {   
      if(result.Ack == 0) {
        this.buttonchange = 0;
      } else{
        this.buttonchange = 1;
      }
    },
    (err) => {
    });
  }

  gotoRate(){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    let paramval={
      "order_id": this.order,
      "user_id":loguser.id
     };
     this.serviceApi.postData(paramval,'users/check_ratting').then((result:any) => {   
      if(result.Ack == 0) {
        this.tost_message('You have already given the ratting');
      } else{
        this.navCtrl.push('RatingPage',{'order_id': this.order});
      }
    },
    (err) => {
    });    
  }

  track(){
    this.navCtrl.push('UserMapPage',{'order_id': this.order,'Latitude':this.myAddressLat,'Lognitude':this.myAddressLong});
  }

  endtrack(){
    this.loadingCustomModal('open');
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: 'Are You Want to Sure?' ,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.loadingCustomModal('close');
          }
        },
        {
          text: 'Ok',
          role: 'Ok',
        handler: () => {
          let paramval={
            "id": this.order,
            "status":"C"
           };
          this.serviceApi.postData(paramval,'users/change_rider_order_status').then((result) => { //console.log(result);
            this.getresult = result;
          //console.log("resulttt",this.getresult);
           if(this.getresult.Ack == 1){
              this.loadingCustomModal('close');
              this.getOrderDet();
           }else{
            this.loadingCustomModal('close');
              this.tost_message('No Detail Found')
            }
          }, (err) => {
            this.loadingCustomModal('close');
          });
          }
        }
      ]
    });
    alert.present();
  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present(); 
  }

  gotoChatDet(ordId){
    this.navCtrl.push('ChatdetailsPage',{'ordDet_id':ordId})
  }

  loadingCustomModal(type:any){
    if(type == 'open'){
      this.loadingConst = this.loadingCtrl.create({
        content: 'Please Wait...'
      });
      this.loadingConst.present();
    }else {
      this.loadingConst.dismiss();
    }
  }  

}
