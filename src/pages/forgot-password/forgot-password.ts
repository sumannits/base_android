import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {
  private form: FormGroup;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public serviceApi: Api,
    private fbuilder: FormBuilder,
    public toastCtrl: ToastController
  ) {

    this.form = this.fbuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ]))
    });
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ForgotPasswordPage');
  }

  doForgotPassword(frmdata:any){
    this.serviceApi.postData(frmdata,'users/forgotpassword').then((result:any) => {
      if(result.Ack == 1){
        let toast = this.toastCtrl.create({
          message: 'Please check your email to get new password.',
          duration: 4000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('LoginPage');
      }else{
        let toast = this.toastCtrl.create({
          message: result.msg,
          duration: 4000,
          position: 'top'
        });
        toast.present();
      }
    }, (err) => {
    
    }); 
  }
  
  public gotoLogin(){
    this.navCtrl.setRoot('LoginPage');
  }
}
