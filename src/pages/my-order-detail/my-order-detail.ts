import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController,ModalController,AlertController,LoadingController} from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the MyOrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-order-detail',
  templateUrl: 'my-order-detail.html',
})
export class MyOrderDetailPage {
  public order:number;
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
  public buttonchange:any;
  public status:any;
  public restaurantLatitude:any;
  public restaurantLongitude:any;
//  private range:Array<number> = [1,2,3,4,5];
  public rate:any;
  public review:any;
  responseData : any;
  public isjobdone:any;
  public loadingConst:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public toastCtrl:ToastController, 
    public modalCtrl: ModalController,
    public alertCtrl:AlertController,
    public loadingCtrl: LoadingController
  ) {
  }

  ionViewDidLoad() {
    this.order=this.navParams.get('order_id');
    this.getOrderDetdata();
  }

  getOrderDetdata(){
    let paramval={
      "order_id": this.order
     };
    this.serviceApi.postData(paramval,'users/rider_assign_orderdetails').then((result) => {
        this.getresult = result;
    //console.log("resulttt",this.getresult);
     if(this.getresult.Ack == 1)
      {
        this.getresult.order_details[0].total_amount = (parseFloat(this.getresult.order_details[0].total_amount) + parseFloat(this.getresult.order_details[0].due_amt));
        this.status=this.getresult.order_details[0].order_status;
        this.restaurantLatitude = parseFloat(this.getresult.order_details[0].lati);
         this.restaurantLongitude = parseFloat(this.getresult.order_details[0].logni);
       if(this.status=='P'){
         this.buttonchange=1;
       }
       else if(this.status=='D'){
        this.buttonchange=0;
       }
      this.ordershow = this.getresult.order_details;
    
       
     }else{
        this.tost_message('No Detail Found')
       }
      
    }, (err) => {
      // Error log
    });
  }

  gotoChatDet(ordId){
    this.navCtrl.push('ChatdetailsPage',{'ordDet_id':ordId});
  }

  getMyRatting(ordId){
    //console.log(ordId);
    this.navCtrl.push('RatingListPage',{'ord_id':ordId})
  }
  
  goloc(id){
    this.navCtrl.push('RiderMapPage',{'order_id':id,'Latitude':this.restaurantLatitude,'Lognitude':this.restaurantLongitude});
  }
  startjourney(){
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
              "status":"P"
             };
            this.serviceApi.postData(paramval,'users/change_rider_order_status').then((result) => { //console.log(result);
              this.getresult = result;
              if(this.getresult.Ack == 1){
                this.loadingCustomModal('close');
                this.ordershow[0].order_status = 'P';
                this.tost_message('You have successfully start your journey');
              }else{
                this.loadingCustomModal('close');
                this.tost_message('No Detail Found');
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

  endjourney(){
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
            "status":"D"
           };
          this.serviceApi.postData(paramval,'users/change_rider_order_status').then((result) => { //console.log(result);
            this.getresult = result;
            if(this.getresult.Ack == 1){
              this.loadingCustomModal('close');
              this.ordershow[0].order_status = 'D';
              this.tost_message('You have successfully delivered this item')
            } else{
              this.loadingCustomModal('close');
              this.tost_message('No Detail Found');
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


  openModal(ordDet:any) {
    let modal = this.modalCtrl.create("ModalTrackPage",{'orderDetails':ordDet});
    modal.present();
  }

  openstatusModal() {
    let modal = this.modalCtrl.create("ModalStatusPage");
    modal.present();
  }

  isBroughtPrd(data:any, key){
    //console.log(data);
    let alert = this.alertCtrl.create({
      title: 'Alert!',
      subTitle: 'Are you sure Bought this Item?' ,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Ok',
          role: 'Ok',
          handler: () => {
              let paramval={
                "id": data.id,
                "is_brought":1
              };
              this.serviceApi.postData(paramval,'users/isbrought_update').then((result:any) => { 
                if(result.Ack == 1){
                  this.ordershow[0].product_list[key].is_brought = 1;
                  this.tost_message('Status has been updated.')
                }else{
                    this.tost_message('No Detail Found');
                }
              }, (err) => {
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
      duration: 3000,
      position: 'bottom'
    });
    toast.present(); 
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
