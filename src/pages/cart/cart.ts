import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController,ModalController} from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  public loginUserId:number = 0;
  public subTot:number = 0;
  public prdActTot:number = 0;
  public DeliveryCharge:number = 0;
  public userCartList = [];
  public alltotal:any;
  public response:any;
  public siteresults:any;
  public adminpercentage:any;
  public freeShippingCostAmt:number = 0;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController
  ) {
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
    this.getdata();
    if(this.loginUserId == 0){
      let toast = this.toastCtrl.create({
        message: 'Please login first.',
        duration: 4000,
        position: 'top'
      });
      toast.present();
      this.navCtrl.setRoot('HomePage');
    }else{
      this.getMyCartList();
    }
  }

  goToCheckout(total,charge){
    this.alltotal=parseFloat(total)+parseFloat(charge);
    this.navCtrl.push('CheckoutPage',{'Total':this.alltotal});
  }


  goToSearch()
  {
    this.navCtrl.push('SearchPage');
  }

  getMyCartList(){
    this.serviceApi.postData({"user_id":this.loginUserId},'users/get_usercartlist').then((result:any) => {
      if(result.Ack == 1){
        this.userCartList = result.product_list;
        //console.log("cartlisttttt",this.userCartList);
        //console.log(this.freeShippingCostAmt);
        //console.log(this.adminpercentage);
        this.subTot = result.sub_tot;
        this.prdActTot = result.act_price;
        if(this.subTot >= this.freeShippingCostAmt){
          this.DeliveryCharge = 0;
        }else{
          this.DeliveryCharge = parseFloat(this.adminpercentage);
        }
        
      }
    }, (err) => {
    
    });
  }

  
  openModal(id) {
    let modal = this.modalCtrl.create("ModalcontentPage",{'cartid':id});
    modal.present();
  }

  updateQty(cartid:number, type:string, qty:any){
    if(cartid > 0){
      if(type == 'add'){
        qty= parseInt(qty)+1;
      }else if(type == 'remove'){
        qty= parseInt(qty)-1;
      }
      //console.log(qty);
      this.serviceApi.postData({"cart_id":cartid, "cart_qty":qty},'users/update_cartqty').then((result:any) => {
        if(result.Ack == 1){
          this.getMyCartList();
          let toast = this.toastCtrl.create({
            message: 'Cart quantity updated successfully.',
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
        }else{
          let toast = this.toastCtrl.create({
            message: 'Something wrong Please try again!',
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
        }
      }, (err) => {
      
      });
    }
  }

  deleteItem(cartid:number){
    let alert = this.alertCtrl.create({
      title: 'Confirm!',
      message: 'Do you want to delete this item?' ,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.serviceApi.postData({"cart_id":cartid},'users/deletefromcart').then((result:any) => {
              if(result.Ack == 1){
                this.getMyCartList();
                let toast = this.toastCtrl.create({
                  message: 'Cart item deleted successfully.',
                  duration: 4000,
                  position: 'bottom'
                });
                toast.present();
              }
            }, (err) => {
            
            });
          }
        }
      ]
    });
    alert.present();
  }

  getdata(){
    this.serviceApi.getData('category/site_settings  ').then((result) => {
      this.response = result
  //console.log("RESULTTTTTTTTTTTTTTTTTT",result);
      if(this.response.Ack == 1)
      {
        this.siteresults =  this.response.site_settings;
        this.adminpercentage=this.siteresults[0].admin_percentage;
        this.freeShippingCostAmt=this.siteresults[0].partner_percentage;
      }
      else
      {
        this.siteresults = '';
      }
    }, (err) => {
      //console.log(11err);
      // Error log
    });

  }
  
  goToPrdDetails(prdId){
    this.navCtrl.push('DetailsPage',{'prd_id':prdId})
  }
}
