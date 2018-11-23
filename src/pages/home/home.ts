import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Platform, AlertController, ToastController, ModalController} from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import {MyApp} from '../../app/app.component';
import { AndroidPermissions } from '@ionic-native/android-permissions';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  public allCatList = [];
  public myCartCnt:number = 0;
  public myProductCnt:number = 0;
  public loginUserId:number = 0;
  public subcatlist:any;
  public catId:any;
  public prdId:any;
  public appHomeText:any;
  public appHomeText1:any;
  public appHomeDesc:any;
  public prdCartQty:number = 1;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public androidPermissions: AndroidPermissions,
    public platform:Platform,
    public myApp:MyApp
  ) {
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
   // this.catId = this.navParams.get('catid');
    this.myApp.menuOpened();
    this.getCatList();
    if(this.loginUserId > 0){
      this.getMyCartCount();
    }
    //console.log(this.getMyProductCount(5));
  }

  ionViewWillEnter(){
    if (this.platform.is('cordova')) {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
        success => console.log('Permission granted'),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
      );
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
    }
  }
  

  goToCart()
  {
    this.navCtrl.push('CartPage');
  }

  decreseQtyCart(prd_list:any,catKey, prdKey){
    let currQty:number = 1;
    if(prd_list.prd_qty_add && prd_list.prd_qty_add >1){
      currQty = prd_list.prd_qty_add -1;
    }else{
      currQty =1;
    }
    this.allCatList[catKey].product_list[prdKey].prd_qty_add = currQty;
    this.prdCartQty = currQty;
  }

  increseQtyCart(prd_list:any, catKey, prdKey){
    //console.log(prd_list);
    let currQty:number = 1;
    if(prd_list.prd_qty_add && prd_list.prd_qty_add > 0){
      currQty = prd_list.prd_qty_add +1;
    }else{
      currQty =1;
    }
    this.allCatList[catKey].product_list[prdKey].prd_qty_add = currQty;
    this.prdCartQty = currQty;
    //console.log(currQty);
  }

  addToCart(catId,prdId){
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
          this.getMyCartCount();
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
      this.navCtrl.push('LoginPage',{'catid':catId});
      
    }
    
  }

  getMyCartCount(){
      this.serviceApi.postData({"user_id": this.loginUserId},'users/get_quantity_count').then((result:any) => {
        if(result.Ack == 1){
          this.myCartCnt = result.count;
        }
      }, (err) => {
      
      }); 
  }

  getMyProductCount(prdId){
    let param={
      "user_id": this.loginUserId,
      "prd_id":prdId
    }
    let CartCnt =0;
    this.serviceApi.postData(param,'users/check_cart_cnt').then((result:any) => {
      //console.log("CXOUNTTT",result);
      if(result.Ack == 1){
        CartCnt = result.prd_qty;
      }else{
        CartCnt = 0;
      }
    }, (err) => {
      
    }); 
    return CartCnt;
}
  
  goToDetails(catId){
    this.navCtrl.push('ProductlistPage',{'catid':catId})
  }
  openCategories() {
    this.navCtrl.push('CateSearchPage');
  }
  goToCatWisePrd(catId){
    this.navCtrl.push('ProductlistPage',{'catid':catId})
  }
  goToSearch()
  {
    this.navCtrl.push('SearchPage');
  }

  getCatList(){
    this.serviceApi.getData('category/catwise_prd_list/'+this.loginUserId).then((result:any) => {
      if(result.Ack == 1){
        this.allCatList = result.cat_list;
        //console.log("CATTATAT",  this.allCatList);
      }
      //console.log(this.userDetails);
    }, (err) => {
     
    });

    this.serviceApi.getData('category/site_settings').then((result:any) => {
      let deliveyStr = result.site_settings[0].app_text;
      let splitDelStr = deliveyStr.split(' ');
      //console.log(splitDelStr);
      this.appHomeText = splitDelStr[0];
      this.appHomeText1 = splitDelStr[1];
      this.appHomeDesc = result.site_settings[0].app_desc;
    }, (err) => {
      
    });

  }

  goToPrdDetails(prdId){
    this.navCtrl.push('DetailsPage',{'prd_id':prdId})
  }

  addCustomOrder(){
    if(this.loginUserId > 0){
      let modal = this.modalCtrl.create("CustomOrderPage");
      modal.present();
      modal.onDidDismiss(data => {
        this.navCtrl.setRoot('HomePage');
      });
    }else{
      let toast = this.toastCtrl.create({
        message: 'Please login first.',
        duration: 4000,
        position: 'bottom'
      });
      toast.present();
      this.navCtrl.setRoot('LoginPage');
    }
  }

}
