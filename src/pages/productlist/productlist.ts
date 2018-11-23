import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController} from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the ProductlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-productlist',
  templateUrl: 'productlist.html',
})
export class ProductlistPage {

  public catId:number = 0;
  public allPrdList = [];
  public catDet:any;
  public loginUserId:number = 0;
  public myCartCnt:number = 0;
  public prdCartQty:number = 1;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController
  ){
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
    this.catId = this.navParams.get('catid');
    this.getCatWisePrdList();
    if(this.loginUserId > 0){
      this.getMyCartCount();
    }
    //console.log(this.loginUserId);
  }

  getMyCartCount(){
      this.serviceApi.postData({"user_id": this.loginUserId},'users/get_quantity_count').then((result:any) => {
        if(result.Ack == 1){
          this.myCartCnt = result.count;
        }
      }, (err) => {
      
      }); 
  }

  getCatWisePrdList(){
    //console.log(this.catId);
    if(this.catId > 0){
      this.serviceApi.getData('category/catwise_prdlist/'+this.catId+"/"+this.loginUserId).then((result:any) => {
        if(result.Ack == 1){
          this.allPrdList = result.product_list;
          this.catDet=result.category_details[0];
          //console.log("allPrdList",result);
        }
      }, (err) => {
      
      });
    }
  }
  
  goToPrdDetails(prdId){
    this.navCtrl.push('DetailsPage',{'prd_id':prdId})
  }

  decreseQtyCart(prd_list:any,catKey){
    let currQty:number = 1;
    if(prd_list.prd_qty_add && prd_list.prd_qty_add >1){
      currQty = prd_list.prd_qty_add -1;
    }else{
      currQty =1;
    }
    this.allPrdList[catKey].prd_qty_add = currQty;
    this.prdCartQty = currQty;
  }

  increseQtyCart(prd_list:any, catKey){
    //console.log(prd_list);
    let currQty:number = 1;
    if(prd_list.prd_qty_add && prd_list.prd_qty_add > 0){
      currQty = prd_list.prd_qty_add +1;
    }else{
      currQty =1;
    }
    this.allPrdList[catKey].prd_qty_add = currQty;
    this.prdCartQty = currQty;
    //console.log(currQty);
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
      this.navCtrl.push('LoginPage',{'catid':this.catId});
    }
    
  }
  
  goToCart(){
    this.navCtrl.push('CartPage');
  }
}
