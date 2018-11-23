import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
/**
 * Generated class for the MobileVerificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mobile-verification',
  templateUrl: 'mobile-verification.html',
})
export class MobileVerificationPage {

  public myCartCnt:number = 0;
  public getresult:any;
  public orderdetail:any;
  public form:FormGroup;
  public mobileno:any;
  public isd:any;
  public concat:any;
  public userid:any;
  public isphoneverify:any;
  public isverify:any;
  public loginUserId:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public serviceApi: Api,public toastCtrl:ToastController,private builder:FormBuilder) {
  
    this.form = builder.group({  
      // 'mobileno': ['', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(13),Validators.pattern('^[0-9]*$'),Validators.required])],
      // 'isd' : ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.pattern('^[0-9+]*$'),Validators.required])]
      'mobileno': ['', Validators.compose([Validators.required, Validators.pattern('[0-9]{10}')])],
      'isd' : ['', Validators.compose([Validators.required])]
    });

    this.mobileno = this.form.controls['mobileno'];
    this.isd = this.form.controls['isd'];
  
    let isUserLogedin = localStorage.getItem('isUserLogedin');
    if (isUserLogedin == '1') {
      let userDetailsJson:any = localStorage.getItem('userPrfDet');
      userDetailsJson = JSON.parse(userDetailsJson);
      this.loginUserId = userDetailsJson.id;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MobileVerificationPage');
      const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
      this.isphoneverify=loguser.is_phone_verify;
      if(this.isphoneverify==1){
        this.isverify=1;
      }
      else{
        this.isverify=0;
      }

      if(this.loginUserId > 0){
        this.getMyCartCount();
      }
    
    
  }

  getMyCartCount(){
    this.serviceApi.postData({"user_id": this.loginUserId},'users/get_quantity_count').then((result:any) => {
      if(result.Ack == 1){
        this.myCartCnt = result.count;
      }
    }, (err) => {
    
    }); 
}

  verify(data){

    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    data.user_id=loguser.id;
  this.concat=data.isd+data.mobileno;
  this.userid=loguser.id
  
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
        this.tost_message('You will receive a message from our system shortly.');
        this.navCtrl.push('VerificationPage',{'phoneno':this.concat});
      }
      else{
        this.tost_message('Otp Sent Fail ! Please Try Again');
      }
      
    }, (err) => {
      //console.log(err);
      this.tost_message('Otp Sent Fail ! Please Try Again');
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

}
