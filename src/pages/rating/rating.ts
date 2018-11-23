import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Ionic2RatingModule } from 'ionic2-rating';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
//import { IonicPage, NavController, NavParams,ToastController } from 'ionic-angular';
import { Api, ResponseMessage } from '../../providers';
/**
 * Generated class for the RatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html'
})
export class RatingPage {
  public form:FormGroup;
public rate:any;
public order:any;
public getresult:any;

public message:AbstractControl;
  constructor(public serviceApi: Api,public navCtrl: NavController, public navParams: NavParams,private appRate: Ionic2RatingModule,public toastCtrl:ToastController,private builder:FormBuilder) {
   
    this.form = builder.group({  
      'message': ['', Validators.compose([Validators.required])]
     
    });
    this.message = this.form.controls['message'];
  }

  ionViewDidLoad() {
    this.order=this.navParams.get('order_id');
    console.log(this.order);
    console.log('ionViewDidLoad RatingPage');
  }
  newRating(ratingEvent: CustomEvent) {
    let rating: number = ratingEvent.detail;
    console.log('New rating: ',rating);
}

onChange(event){
//alert(event);

this.rate=event;
}



rateReview(){
    let data:any=this.form.value;
    const loguser = JSON.parse(localStorage.getItem('userPrfDet'));
    let paramval={
      "order_id": this.order,
      "user_id":loguser.id,
      "ratting":this.rate,
      "message":data.message
    };
    this.serviceApi.postData(paramval,'users/ratting').then((result) => { //console.log(result);
    this.getresult = result;
    if(this.getresult.Ack == 1){
      this.tost_message('You have successfully give the ratting.')
      this.navCtrl.push('OrderListPage');
    }else{
      this.tost_message('No Detail Found')
      //alert('tost_message');
    }
    
  }, (err) => {
    
  });
 
}
tost_message(msg){
  let toast = this.toastCtrl.create({
    message: msg,
    duration: 3000
  });}
}
