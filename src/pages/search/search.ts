import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, Keyboard,ModalController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html'
})
export class SearchPage {
  public allPrdList = [];
  public loginUserId:number = 0;
  public myCartCnt:number = 0;
  public searchItem: string = '';
  public prdCartQty:number = 1;

  constructor(
    public navCtrl: NavController,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public keyboard: Keyboard
  ) { 
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
    if(this.loginUserId > 0){
      this.getMyCartCount();
    }
    // if(this.searchItem==''){
    //   this.keyboard.close()
    // }
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

  getItems(ev) {
    let val = ev.target.value;
    let searchKeyWord = '';
    if (!val || !val.trim()) {
      searchKeyWord = ''
      this.keyboard.close();
    }else{
      searchKeyWord = val
    } 
    this.serviceApi.postData({"keyword": searchKeyWord, "cat_id":"","user_id":this.loginUserId},'users/product_search').then((result:any) => {
      if(result.Ack == 1){
        this.allPrdList = result.product_list;
        //console.log(this.allPrdList);
      }
    }, (err) => {
    
    }); 
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
      let alert = this.alertCtrl.create({
        title: 'Alert!',
        subTitle: 'Please login first to add this product in your cart.' ,
        buttons: ['Ok']
      });
      alert.present();
    }
    
  }

  goToCart(){
    this.navCtrl.push('CartPage');
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
