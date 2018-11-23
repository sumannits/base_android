import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SubCatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sub-cate',
  templateUrl: 'sub-cate.html',
})
export class SubCatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubCatePage');
  }

  openCategories() {
    this.navCtrl.push('CateSearchPage');
  }

  goToCart()
  {
    this.navCtrl.push('CartPage');
  }

}
