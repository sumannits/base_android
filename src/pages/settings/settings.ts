import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
/**
 * The Settings page is a simple form that syncs with a Settings provider
 * to enable the user to customize settings for the app.
 *
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  public form: FormGroup;
  public userId:number = 0;
  public pwsCheck:boolean = true;

  constructor(public navCtrl: NavController,
    //public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public serviceApi: Api,
    private fbuilder: FormBuilder,
    public toastCtrl: ToastController
  ) {
    let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
        let userDetailsJson:any = localStorage.getItem('userPrfDet');
        userDetailsJson = JSON.parse(userDetailsJson);
        this.userId = userDetailsJson.id;
    }
    this.form = this.fbuilder.group({
      pass: new FormControl('', Validators.compose([
        Validators.required
      ])),
      cpass: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    //this.form = this.formBuilder.group({});
  }

  updatePassword(frmdata:any) {
    let password = frmdata.pass;
    let cpassword = frmdata.cpass;
    if(password!=cpassword){
      this.pwsCheck = false;
    }else{
      this.pwsCheck = true;
      this.serviceApi.postData({"id": this.userId, "pass":password},'users/update_password').then((result:any) => {
        if(result.Ack == 1){
          let toast = this.toastCtrl.create({
            message: 'Password Updated Successfully.',
            duration: 4000,
            position: 'bottom'
          });
          toast.present();
        }
      }, (err) => {
      
      }); 
    }
    //console.log(frmdata.pass);
  }
}
