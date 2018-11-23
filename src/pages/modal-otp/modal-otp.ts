import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IonicPage, NavController, NavParams,ToastController,Platform, LoadingController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Device } from '@ionic-native/device';
declare var SMS:any;

/**
 * Generated class for the ModalOtpPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-otp',
  templateUrl: 'modal-otp.html',
})
export class ModalOtpPage {

  public getresult:any;
  public orderdetail:any;
  public form:FormGroup;
  public otp:any;
  public getFrmPageName:any;
  public phoneLoginUserId:any;
  public loadingConst:any;
  public uuid:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private device: Device,
    public serviceApi: Api,
    public toastCtrl:ToastController,
    private builder:FormBuilder,
    public loadingCtrl:LoadingController,
    public androidPermissions: AndroidPermissions,
    public platform:Platform
  ) {
    this.uuid = localStorage.getItem('DEVICETOKEN');
    this.form = builder.group({  
      'otp': ['', Validators.compose([Validators.required])]
    });
    this.otp = this.form.controls['otp'];
  }

  ionViewDidLoad() {
    this.getFrmPageName = this.navParams.get('fromPage');
    this.ReadSMS();
    //let text = 'Hey! This is your otp : 1258 no for Base mobile verification';
    this.phoneLoginUserId = localStorage.getItem('phoneLoginUserId');
    //console.log(this.getFrmPageName);
    //console.log(this.phoneLoginUserId);
  }


// ionViewWillEnter(){
//   if (this.platform.is('cordova')) {
//     this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
//       success => console.log('Permission granted'),
//     err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
//     );
//     this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
//   }
// }

ReadSMS(){
  if (this.platform.is('cordova')) {
    this.loadingCustomModal('open');
    this.platform.ready().then((readySource) => {

    if(SMS) SMS.startWatch(()=>{
              //console.log('watching started');
            }, Error=>{
          //console.log('failed to start watching');
      });

    document.addEventListener('onSMSArrive', (e:any)=>{
       let sms = e.data;
       let splitstring =sms.body;
       if(splitstring!=''){
          let sptStr:any = splitstring.split(':');
          if(sptStr.length >0){
            let getOtp:any = sptStr[1].split(' ');
            if(getOtp.length > 0){
              getOtp.forEach(element => {
                if(element!='' && parseInt(element)){
                  this.form.controls['otp'].setValue(element);
                  this.loadingCustomModal('close');  
                }
              });
            }
          }
       }
      
       });
    });
  }
}
 
dismiss() {
  this.navCtrl.pop();
}

verify(data){
  this.loadingCustomModal('open');
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    if(this.getFrmPageName == 'LoginPhonePage'){
      data.user_id=this.phoneLoginUserId;
    }else{
      data.user_id=loguser.id;
    }
    data.otp=data.otp.trim();
    data.device_token_id=this.uuid;
    data.device_type=this.device.platform;
    this.serviceApi.postData(data,'users/phone_checkotp').then((result:any) => { 
      //console.log(result);
      if(result.Ack == 1){
        if(this.getFrmPageName == 'LoginPhonePage'){
          localStorage.setItem('phoneLoginUserId', '');
          let userId= result.user_details.id
          localStorage.setItem('userPrfDet', JSON.stringify(result.user_details));
          //console.log(result.user_details);
          localStorage.setItem('isUserLogedin', '1');
          this.loadingCustomModal('close'); 
          this.tost_message('You have successful login with your phone no.');
          this.dismiss();
          //this.navCtrl.setRoot('HomePage');
        }else{
          this.loadingCustomModal('close'); 
          this.tost_message('Signup Successful');
          this.dismiss();
         // this.navCtrl.push('LoginPage');
        }
      }else{
        this.loadingCustomModal('close'); 
        this.tost_message('Not Found');
      }
    }, (err) => {
      this.loadingCustomModal('close'); 
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
}
