import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Api, ResponseMessage } from '../../providers';
/**
 * Generated class for the ModalStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal-status',
  templateUrl: 'modal-status.html',
})
export class ModalStatusPage {
  public form:FormGroup;
  public description:any;
  public getresult:any;
  public cartId:any;
  public status:any;
  public price:any;
  public ordershow:any;
  public order:any;
  

  constructor(public navCtrl: NavController, public navParams: NavParams,private builder:FormBuilder,public serviceApi: Api,public toastCtrl:ToastController) {

    this.form = builder.group({  
      'status': ['', Validators.required]
    
    });
    this.status = this.form.controls['status'];
   
  }
  
  dismiss() {
    // this.viewCtrl.dismiss();
    this.navCtrl.pop();
   }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalStatusPage');
  }

  save(data){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    data.user_id=loguser.id;
  console.log("PARRAMM",data);
    this.serviceApi.postData(data,'users/change_rider_order_status').then((result) => { 
    //  console.log(result);
      this.getresult = result;
      if(this.getresult.Ack == 1)
      {
     
       this.tost_message('Status Changed')
       this.dismiss();
       //this.navCtrl.push("MyOrderDetailPage");
      }
      else{
        this.tost_message('Not Found')
      }
    }, (err) => {
      console.log(err);
      this.tost_message('Not Found')
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
