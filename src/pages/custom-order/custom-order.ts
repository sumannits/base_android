import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController,ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the CustomOrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-custom-order',
  templateUrl: 'custom-order.html',
})
export class CustomOrderPage {

  public form: FormGroup;
  public userId:number = 0;
  public catList = [];
  public loadingConst:any;

  constructor(
    public navCtrl: NavController, 
    public fbuilder: FormBuilder,
    public serviceApi: Api,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public loadingCtrl:LoadingController,
    public navParams: NavParams
  ) {
    let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      let userDetailsJson:any = localStorage.getItem('userPrfDet');
      userDetailsJson = JSON.parse(userDetailsJson);
      this.userId = userDetailsJson.id;
    }

    this.form = this.fbuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      /*cat_id: new FormControl('', Validators.compose([
        Validators.required
      ])),*/
      quantity: new FormControl('', Validators.compose([
        Validators.required
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  ionViewDidLoad() {
    this.getCatList();
  }

  getCatList(){
    this.serviceApi.getData('category/list').then((result:any) => {
      //console.log(result);
      if(result.Ack == 1){
        this.catList = result.cat_list;
      }
      
    }, (err) => {
     
    });
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
   
  dismissModal() {
    this.navCtrl.pop();
    //this.navCtrl.setRoot('HomePage');
  }

  addUserCustomPrd(data:any){
    console.log(data);
    this.loadingCustomModal('open');
      data.user_id=this.userId;
      data.cat_id = 0;
      this.serviceApi.postData(data,'users/add_usercustomprd').then((result:any) => { 
        //console.log(result);
        if(result.Ack == 1){
          this.loadingCustomModal('close');
          this.tost_message('You have successful add your custom product.');
          this.navCtrl.pop();
        }else{
          this.loadingCustomModal('close');
          this.tost_message(result.msg);
        }
      }, (err) => {
        this.loadingCustomModal('close');
      });
  }
}
