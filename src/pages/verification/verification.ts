import { Component } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { IonicPage, NavController, NavParams,ToastController,Platform } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Device } from '@ionic-native/device';
declare var SMS:any;
//import { SMS } from '@ionic-native/sms';
/**
 * Generated class for the VerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-verification',
  templateUrl: 'verification.html',
})


export class VerificationPage {

  public getresult:any;
  public orderdetail:any;
  public form:FormGroup;
  public otp:any;
  public mobileno:any;
  public uuid:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,public serviceApi: Api,public toastCtrl:ToastController,private builder:FormBuilder,
    private device: Device,
    public androidPermissions: AndroidPermissions,public platform:Platform) {
      this.uuid = localStorage.getItem('DEVICETOKEN');
    this.form = builder.group({  
      'otp': ['', Validators.compose([Validators.required])]
    });

    this.otp = this.form.controls['otp'];
  
  
  }
  ionViewDidLoad() {
    this.mobileno=this.navParams.get('phoneno');
    //console.log('ionViewDidLoad VerificationPage');
    this.ReadSMS();
    //let text = 'Hey! This is your otp : 1258 no for Base mobile verification';
    
  }


  ionViewWillEnter()
{
  if (this.platform.is('cordova')) {
this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_SMS).then(
  success => console.log('Permission granted'),
err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_SMS)
);

this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.READ_SMS]);
  }
}

ReadSMS()
{
  if (this.platform.is('cordova')) {
this.platform.ready().then((readySource) => {

if(SMS) SMS.startWatch(()=>{
           console.log('watching started');
        }, Error=>{
       console.log('failed to start watching');
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
                }
              });
            }
          }
       }
       //console.log("SMSMMS",sms.body);
       //this.form.controls['otp'].setValue(sms);

       });
     
    });
}
}
 
  verify(data){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    data.user_id=loguser.id;
    data.otp=data.otp.trim();
    data.device_token_id=this.uuid;
    data.device_type=this.device.platform;
    this.serviceApi.postData(data,'users/phone_checkotp').then((result) => { 
      //console.log(result);
      this.getresult = result;
      if(this.getresult.Ack == 1)
      {
        this.tost_message('Verified');
        this.navCtrl.push('MobileVerificationPage');
   
      }
      else{
        this.tost_message('Not Found');
      }
      
    }, (err) => {
      console.log(err);
    
    });


  }

  resend(){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
  let param={
'user_id':loguser.id,
'phone_no': this.mobileno
  }
    this.serviceApi.postData(param,'users/phone_sentotp').then((result) => { 
     console.log(result);
      this.getresult = result;
      if(this.getresult.Ack == 1)
      {
        this.tost_message('Your otp Sent to mobile')
      }
      else{
        this.tost_message('No Detail Found')
      }
    }, (err) => {
      console.log(err);
      this.tost_message('No Detail Found')
    });
  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
    }


}
