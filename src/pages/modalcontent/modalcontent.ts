import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { Api, ResponseMessage } from '../../providers';
/**
 * Generated class for the ModalcontentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modalcontent',
  templateUrl: 'modalcontent.html',
})
export class ModalcontentPage {
  public form:FormGroup;
  public note:any;
  public getresult:any;
  public cartId:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,private builder:FormBuilder,public serviceApi: Api,public toastCtrl:ToastController) {

    this.form = builder.group({  
      'note': ['', Validators.required]
    
    });

    this.note = this.form.controls['note'];
   
  }

  dismiss() {
    // this.viewCtrl.dismiss();
    this.navCtrl.pop();
   }

  ionViewDidLoad() {
    this.cartId = this.navParams.get('cartid');
    console.log('ionViewDidLoad ModalcontentPage');
    this.getnote();
  }

  savenote(data){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    data.user_id=loguser.id;
    data.id=this.cartId
  console.log("PARRAMM",data);
    this.serviceApi.postData(data,'users/additional_note').then((result) => { 
    //  console.log(result);
      this.getresult = result;
      if(this.getresult.Ack == 1)
      {
       this.dismiss();
       this.tost_message('Notes Added')
      }
      else{
        this.tost_message('Not Found')
      }
    }, (err) => {
      console.log(err);
      this.tost_message('Not Found')
    });
  }

  getnote(){
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
  let param={
    "user_id": loguser.id,
    "id":this.cartId
  }
     this.serviceApi.postData(param,'users/get_cartnote').then((result) => { 
     //  console.log("Result",result);
       this.getresult = result;
       if(this.getresult.Ack == 1)
       {
        this.form.controls['note'].setValue(this.getresult.cart_data[0].note);
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
