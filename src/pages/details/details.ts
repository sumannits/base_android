import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
/**

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {

  public prdId:number = 0;
  public prdDetails:any;
  public loginUserId:number = 0;
  public myCartCnt:number = 0;
  public prdCartQty:number = 1;
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ) {
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
    this.prdId = this.navParams.get('prd_id');
    this.getPrdDetails();
    if(this.loginUserId > 0){
      this.getMyCartCount();
    }
  }

  goToCart(){
    this.navCtrl.push('CartPage');
  }
  goToSearch(){
    this.navCtrl.push('SearchPage');
  }

  getMyCartCount(){
      this.serviceApi.postData({"user_id": this.loginUserId},'users/get_quantity_count').then((result:any) => {
        if(result.Ack == 1){
          this.myCartCnt = result.count;
        }
      }, (err) => {
      
      }); 
  }

  getPrdDetails(){
    if(this.prdId > 0){
      this.serviceApi.getData('category/product_details/'+this.prdId).then((result:any) => {
        if(result.Ack == 1){
          this.prdDetails = result.product_details;
          //console.log(this.prdDetails);
        }
      }, (err) => {
      
      });
    }
  }


  decreseQtyCart(prd_list:any){
    let currQty:number = 1;
    if(prd_list.prd_qty_add && prd_list.prd_qty_add >1){
      currQty = prd_list.prd_qty_add -1;
    }else{
      currQty =1;
    }
    this.prdDetails.prd_qty_add = currQty;
    this.prdCartQty = currQty;
  }

  increseQtyCart(prd_list:any){
    let currQty:number = 1;
    if(prd_list.prd_qty_add && prd_list.prd_qty_add > 0){
      currQty = prd_list.prd_qty_add +1;
    }else{
      currQty =1;
    }
    this.prdDetails.prd_qty_add = currQty;
    this.prdCartQty = currQty;
  }

  addToCart(prdId){
    if(this.loginUserId > 0){
      this.serviceApi.postData({"user_id":this.loginUserId, "prd_id":prdId,"prd_qty":this.prdCartQty},'users/addto_cart').then((result:any) => {
        if(result.Ack == 1){
          this.prdCartQty = 1;
          let toast = this.toastCtrl.create({
            message: result.msg,
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
        }else{
          let toast = this.toastCtrl.create({
            message: result.msg,
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
        }
      }, (err) => {
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Something wrong.Please try again.' ,
          buttons: ['Ok']
        });
        alert.present();
      });
    }else{
      this.navCtrl.push('LoginPage',{'prd_id': this.prdId});
    }
    this.getMyCartCount();
  }
}
