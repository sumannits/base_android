import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController,ModalController,LoadingController } from 'ionic-angular';
import { Api } from '../../providers';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Facebook } from '@ionic-native/facebook';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  private form: FormGroup;
  private checkEmailExist:boolean=true;
  // Our translated text strings
  private signupErrorString: string;

  public first_name: AbstractControl;
  public last_name: AbstractControl;
  public email: AbstractControl;
  public phone: AbstractControl;
  public password: AbstractControl;
  public cpassword: AbstractControl;
  public isd:AbstractControl;
  public concat:any;
  public userid:any;
  public getresult:any;
  public isFrmValid:boolean = true;
  public loadingConst:any; 
  public faceBookUId:any; 
  public uuid:any;

  constructor(
    public navCtrl: NavController,
    public userService: Api,
    private device: Device,
    private fbuilder: FormBuilder,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    public modalCtrl: ModalController,
    public loadingCtrl:LoadingController,
    private fb:Facebook,
    public serviceApi: Api
  ) {
    this.uuid = localStorage.getItem('DEVICETOKEN');
    this.form = fbuilder.group({
      'first_name': ['', Validators.compose([Validators.required, Validators.pattern('([a-zA-Z])+([a-zA-Z\- ])+')])],
      'last_name': ['', Validators.compose([Validators.required, Validators.pattern('([a-zA-Z])+([a-zA-Z\- ])+')])],
      'email': ['', Validators.compose([Validators.required,Validators.email])],
      'phone': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(5)])],
      'cpassword': ['', Validators.compose([Validators.required])],
      'isd' : ['', Validators.compose([Validators.required])]
    });
    this.first_name = this.form.controls['first_name'];
    this.last_name = this.form.controls['last_name'];
    this.email = this.form.controls['email'];
    this.phone = this.form.controls['phone'];
    this.password = this.form.controls['password'];
    this.cpassword = this.form.controls['cpassword'];
    this.isd = this.form.controls['isd'];
  }

  doSignup(val : any) {
    let loading = this.loadingCtrl.create({
      content: 'Please Wait...'
    });
    loading.present();
    //console.log(val);
    let password = this.password.value.toString();
    let cpassword = this.cpassword.value.toString();
    let CheckvalidEmail = this.email.value.toString();
    CheckvalidEmail.trim();
    let isValidEmail = this.validateEmail(CheckvalidEmail);
    //console.log(this.faceBookUId);
    if(this.faceBookUId!=undefined){
      let signupJsonData={
        "first_name": this.first_name.value.toString(),
        "last_name": this.last_name.value.toString(),
        "email": CheckvalidEmail,
        "password": this.password.value.toString(),
        "user_type":1,
        "is_active": 1,
        "phone": this.phone.value.toString(),
        "is_email_verified": 1,
        "fb_user_id": this.faceBookUId,
        "device_token_id": this.device.uuid,
        "device_type": this.device.platform
      };
      
      this.userService.postData(signupJsonData,'users/facebook_signup').then((result:any) => {
        if(result.Ack == 1){
          localStorage.setItem('userPrfDet', JSON.stringify(result.UserDetails));
          //console.log("USERRR",localStorage.getItem('userPrfDet'));
          localStorage.setItem('isUserLogedin', '1');
          this.loadingCustomModal('close');
          this.tost_message('You have successfully login.');   
          this.navCtrl.setRoot('HomePage');
        }
        loading.dismiss();
      }, (err) => {
        loading.dismiss();
      });
    }else if(password==cpassword && isValidEmail){
      this.userService.postData({"email":CheckvalidEmail},'users/appsearchbyemail').then((result:any) => {
        if(result.Ack == 1){
          this.isFrmValid=false;
          let alert = this.alertCtrl.create({
            title: 'Error!',
            subTitle: 'Email Id Already Exist',
            buttons: ['Ok']
          });
          alert.present();
        }else{
          this.isFrmValid=true;
        }
        loading.dismiss();
      }, (err) => {
        loading.dismiss();
      });

      //
    }else if(!isValidEmail){
      this.isFrmValid=false;
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Please enter valid email',
        buttons: ['Ok']
      });
      alert.present();
      loading.dismiss();
    }else if(password!=cpassword){
      this.isFrmValid=false;
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Password and confirm password must match.',
        buttons: ['Ok']
      });
      alert.present();
      loading.dismiss();
    }

    if (this.form.valid && this.isFrmValid && this.faceBookUId==undefined) {
      let signupJsonData={
        "first_name": this.first_name.value.toString(),
        "last_name": this.last_name.value.toString(),
        "email": CheckvalidEmail,
        "password": this.password.value.toString(),
        "user_type":1,
        "is_active": 0,
        "phone": this.phone.value.toString(),
        "is_email_verified": 0,
        "device_token_id": this.device.uuid,
        "device_type": this.device.platform
      };
      //console.log(filterIntData);
      this.userService.postData(signupJsonData,'users/appsignup').then((result:any) => {
        if(result.Ack ==1){
          localStorage.setItem('userPrfDet', JSON.stringify(result.UserDetails));
          localStorage.setItem('isUserLogedin', '1');
          this.concat='+'+this.isd.value.toString()+this.phone.value.toString();
          const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
          this.userid=loguser.id;
          let fromPage='SignupPage';
          let param={
            'user_id':this.userid,
            'phone_no':this.concat
              }
              //console.log("PARRAMM",param);
                this.serviceApi.postData(param,'users/phone_sentotp').then((result) => { 
                 //console.log(result);
                  this.getresult = result;
                  if(this.getresult.Ack == 1)
                  { 
                    loading.dismiss();    
                    this.tost_message('You will receive a message from our system shortly.');  
                     let modal = this.modalCtrl.create("ModalOtpPage", {fromPage: fromPage});
                    modal.present();
                    modal.onDidDismiss(data => {
                      //console.log(data);
                      //this.navCtrl.push('LoginPage');
                      this.navCtrl.setRoot('HomePage');
                    });
                  }else{
                    loading.dismiss();
                    this.tost_message('Message could not be sent.');
                    this.navCtrl.setRoot('HomePage');
                  }
                }, (err) => {
                  //console.log(err);
                  loading.dismiss();
                });
        }else{
          loading.dismiss();  
        }
      }, (err) => {
        loading.dismiss();
        
      });
    }  
  }

  tost_message(msg){
    let toast = this.toastCtrl.create({
     message: msg,
     duration: 3000
   });
   toast.present(); 
    }


  public validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  public onLogin() {
    this.navCtrl.push('LoginPage');
  }

  public forgotPassword(){
    this.navCtrl.setRoot('ForgotPasswordPage');
  }

  facebookSignIn(){
    this.fb.login(['public_profile', 'email']).then(res => {
        if(res.status === "connected") {
          //console.log(res.authResponse);
          //this.isLoggedIn = true;
          this.getFacebookUserDetail(res.authResponse.userID);
        } else {
          //this.isLoggedIn = false;
        }
    }).catch(e => 
      console.log('Error logging into Facebook', e)
    );
  }


  getFacebookUserDetail(userid) {
    this.loadingCustomModal('open');
    this.fb.api("/"+userid+"/?fields=id,email,name,picture,gender",["public_profile"]).then(res => {
      let usersFData = res;
      this.serviceApi.postData({"app_id":userid,"login_type":"fb","device_token_id": this.uuid,"device_type": this.device.platform},'users/facebook_logincheck').then((result:any) => { 
       
         if(result.Ack == 1){ 
          localStorage.setItem('userPrfDet', JSON.stringify(result.UserDetails));
          //console.log("USERRR",localStorage.getItem('userPrfDet'));
          localStorage.setItem('isUserLogedin', '1');
          this.loadingCustomModal('close');
          this.tost_message('You have successfully login.');   
          this.navCtrl.setRoot('HomePage');
         }else{
            this.loadingCustomModal('close');
            this.faceBookUId = userid;
            let nameSplt = usersFData.name;
            var splNameStr = nameSplt.split(' ');
            this.form.get('first_name').setValue(splNameStr[0]);
            this.form.get('last_name').setValue(splNameStr[1]);
            this.form.get('email').setValue(usersFData.email); 
            this.form.get('password').setValue(userid); 
            this.form.get('cpassword').setValue(userid);
            this.tost_message(result.msg)
         }
       }, (err) => {
          this.loadingCustomModal('close');
       });
       
      }).catch(e => {
        this.loadingCustomModal('close');
        this.tost_message('No Profile Found')
      });
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
