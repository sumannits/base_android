import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController,NavParams,LoadingController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { FormControl, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { Device } from '@ionic-native/device';
import { Broadcaster } from '../../providers/eventEmitter';
import { HomePage } from '../home/home';
import { ProductlistPage } from '../productlist/productlist';
import {DetailsPage} from '../details/details';
import * as firebase from 'firebase';
import { Facebook } from '@ionic-native/facebook';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
 
  // Our translated text strings
  private loginErrorString: string;
  private form: FormGroup;
  public email: AbstractControl;
  public password: AbstractControl;
  public catId:any;
  public prdId:any;
  public loguserDet:any;
  public loadingConst:any; 
  public uuid:any;

  constructor(
    public navCtrl: NavController,
    private device: Device,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public userService: Api,
    private fbuilder: FormBuilder,
    private fb:Facebook,
    public loadingCtrl:LoadingController,
    public translateService: TranslateService,
    private broadCastre:Broadcaster
  ) {

    this.uuid = localStorage.getItem('DEVICETOKEN');
    this.form = fbuilder.group({
      'email': ['', Validators.compose([Validators.required,Validators.email])],
      'password': ['', Validators.compose([Validators.required])],
    });
    this.email = this.form.controls['email'];
    this.password = this.form.controls['password'];
  }

  ionViewDidLoad() {
    this.catId = this.navParams.get('catid');
    this.prdId = this.navParams.get('prd_id');
  
  }
  // Attempt to login in through our User service
  doLogin() {

    let CheckvalidEmail = this.email.value.toString();
    let isValidEmail = this.validateEmail(CheckvalidEmail);
    if (this.form.valid && isValidEmail) {
      let signinJsonData={
        "email": this.email.value.toString(),
        "password": this.password.value.toString(),
        "device_token_id": this.uuid,
        "device_type": this.device.platform
      };
      this.userService.postData(signinJsonData,'users/appsignin').then((result:any) => {
        //console.log(result);
        if(result.Ack == 1){
          let userId= result.UserDetails.id
          localStorage.setItem('userPrfDet', JSON.stringify(result.UserDetails));
          //console.log("USERRR",localStorage.getItem('userPrfDet'));
          localStorage.setItem('isUserLogedin', '1');
          if(localStorage.getItem('userPrfDet')){
            this.loguserDet = JSON.parse(localStorage.getItem('userPrfDet'));
             if(this.catId){
              this.broadCastre.broadcast('userLoggedIn', result.UserDetails);
              this.navCtrl.push('ProductlistPage',{'catid':this.catId});

             }
             else if(this.prdId){
              this.broadCastre.broadcast('userLoggedIn', result.UserDetails);
              this.navCtrl.push('DetailsPage',{'prd_id':this.prdId});
             }
             else if(this.loguserDet.user_type==0){
              this.navCtrl.setRoot('MyOrderPage');
             }
             else{
              this.broadCastre.broadcast('userLoggedIn', result.UserDetails);
              this.navCtrl.setRoot('HomePage');

             }
          }
          firebase.auth().signInWithEmailAndPassword(CheckvalidEmail, CheckvalidEmail)
          .then(res => {
             //console.log("firebase",res);
          })
          .catch(err => {
            firebase.auth().createUserWithEmailAndPassword(CheckvalidEmail, CheckvalidEmail)
              .then(res => {
                //console.log(res);
              })
              .catch(err2 => {
                //console.log(err2);
              });
          });
          // let toast = this.toastCtrl.create({
          //   message: 'You have successfully login.',
          //   duration: 4000,
          //   position: 'top'
          // });
          // toast.present();
         
        }else{
          if(result.msg != ''){
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: result.msg ,
              buttons: ['Ok']
            });
            alert.present();
          }else{
            let alert = this.alertCtrl.create({
              title: 'Error!',
              subTitle: 'Wrong Email or Password.Please try again.' ,
              buttons: ['Ok']
            });
            alert.present();
          }
        }
      }, (err) => {
        // let alert = this.alertCtrl.create({
        //   title: 'Error!',
        //   subTitle: this.jsonErrMsg.messageData(err),
        //   buttons: ['Ok']
        // });
        // alert.present();
      });
    }else if(!isValidEmail){
      let alert = this.alertCtrl.create({
        title: 'Error!',
        subTitle: 'Please enter valid email',
        buttons: ['Ok']
      });
      alert.present();
    }else{
      let toast = this.toastCtrl.create({
        message: 'You enter wrong email and password',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    }
  }

  public validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  public gotoSignupPage(){
    this.navCtrl.setRoot('SignupPage');
  }
  
  public forgotPassword(){
    this.navCtrl.setRoot('ForgotPasswordPage');
  }

  facebookSignIn(){
    this.fb.login(['public_profile', 'email']).then(res => {
        if(res.status === "connected") {
          console.log(res.authResponse);
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
      this.userService.postData({"app_id":userid,"login_type":"fb","device_token_id": this.uuid,"device_type": this.device.platform},'users/facebook_logincheck').then((result:any) => { 
         if(result.Ack == 1){ 
          localStorage.setItem('userPrfDet', JSON.stringify(result.UserDetails));
          //console.log("USERRR",localStorage.getItem('userPrfDet'));
          localStorage.setItem('isUserLogedin', '1');
          this.loadingCustomModal('close');
          this.tost_message('You have successfully login.');   
          this.navCtrl.setRoot('HomePage');
         }else{
            this.loadingCustomModal('close');
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

  tost_message(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000
    });
    toast.present(); 
  }
}
