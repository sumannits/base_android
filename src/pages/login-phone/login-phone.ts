import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController,ModalController,LoadingController,NavParams } from 'ionic-angular';
import { Api } from '../../providers';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Device } from '@ionic-native/device';

/**
 * Generated class for the LoginPhonePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login-phone',
  templateUrl: 'login-phone.html',
})
export class LoginPhonePage {
  private form: FormGroup;
  public phone: AbstractControl;
  public isd:AbstractControl;
  public isFrmValid:boolean = true;
  public loadingConst:any;
  
  constructor(
      public navCtrl: NavController,
      private device: Device,
      public navParams: NavParams,
      private fbuilder: FormBuilder,
      public alertCtrl: AlertController,
      public toastCtrl: ToastController,
      public modalCtrl: ModalController,
      public loadingCtrl:LoadingController,
      public serviceApi: Api

  ) {
    this.form = fbuilder.group({
      'phone': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
      'isd' : ['', Validators.compose([Validators.required])]
    });
    this.phone = this.form.controls['phone'];
    this.isd = this.form.controls['isd'];

  }
  //'isd' : ['', Validators.compose([Validators.required,Validators.minLength(1),Validators.maxLength(3),Validators.pattern('^[0-9]*'),Validators.required])]
  ionViewDidLoad() {
    //console.log('ionViewDidLoad LoginPhonePage');
  }

  goToSearch(){
    this.navCtrl.push('SearchPage');
  }

  doPhoneLogin(val : any){
    if (this.form.valid) {
      let phoneNo = val.phone;
      let isdCode = val.isd;
      let fromPage='LoginPhonePage';
      let newConcat='+'+isdCode.toString()+phoneNo.toString();
      if(phoneNo!=''){
        this.loadingCustomModal('open');
        this.serviceApi.postData({"phone_no":phoneNo},'users/check_phone_no').then((result:any) => {
          if(result.Ack == 1){
            let userDet = result.user_details;
            let getUserId = userDet.id;
            localStorage.setItem('phoneLoginUserId', getUserId);
            this.serviceApi.postData({"user_id":getUserId, "phone_no":newConcat},'users/phone_sentotp').then((result:any) => { 
              this.loadingCustomModal('close');
                if(result.Ack == 1){ 
                  this.loadingCustomModal('close');  
                  this.tost_message('You will receive a message from our system shortly.');     
                  let modal = this.modalCtrl.create("ModalOtpPage", {fromPage: fromPage});
                  modal.present();
                  modal.onDidDismiss(data => {
                   // this.loadingCustomModal('close');
                    this.navCtrl.setRoot('HomePage');
                  });                           
                }else{
                  this.loadingCustomModal('close');
                  this.tost_message(result.msg)
                }
            }, (err) => {
              this.loadingCustomModal('close');
            });
          }else{
            this.loadingCustomModal('close');
            this.tost_message(result.msg);
          }
        }, (err) => {
           
        });
      }else{
        this.tost_message('This phone no did not found in our system.');
      }
       
    }else{
      this.tost_message('You input wrong details');
    }
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
    }else if(type == 'close'){
      this.loadingConst.dismiss();
    }
  }
}
