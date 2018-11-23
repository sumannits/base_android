import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
/**
 * Generated class for the CateSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cate-search',
  templateUrl: 'cate-search.html',
})
export class CateSearchPage {
  public allCatList = [];
  public myCartCnt:number = 0;
  public loginUserId:number = 0;
  
  constructor(
    public navCtrl: NavController,
    public serviceApi: Api,
    public alertCtrl: AlertController,
    public navParams: NavParams
  ) {
      let isUserLogedin = localStorage.getItem('isUserLogedin');
      if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.loginUserId = userDetailsJson.id;
      }
  }

  ionViewDidLoad() {
    this.getCatList();
    if(this.loginUserId > 0){
      this.getMyCartCount();
    }
  }

  goToCart(){
    this.navCtrl.push('CartPage');
  }

  goToCatWisePrd(catId){
    this.navCtrl.push('ProductlistPage',{'catid':catId})
  }

  getMyCartCount(){
    this.serviceApi.postData({"user_id": this.loginUserId},'users/get_quantity_count').then((result:any) => {
      if(result.Ack == 1){
        this.myCartCnt = result.count;
      }
    }, (err) => {
    
    }); 
  }

  getCatList(){
    this.serviceApi.getData('category/list').then((result:any) => {
      if(result.Ack == 1){
        this.allCatList = result.cat_list;
        //console.log(this.allCatList);
      }
    }, (err) => {
     
    });
  }

  goToSearch(){
    this.navCtrl.push('SearchPage');
  }
}
