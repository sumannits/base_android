import { Component ,ViewChild,ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,LoadingController, ToastController,ActionSheetController,Platform } from 'ionic-angular';

import { Geolocation } from '@ionic-native/geolocation';
import { FormControl, AbstractControl, FormBuilder, Validators, FormGroup} from '@angular/forms';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,LatLng
 } from '@ionic-native/google-maps';
 import * as firebase from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Api, ResponseMessage } from '../../providers';

/**
 * Generated class for the LocationmapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-locationmap',
  templateUrl: 'locationmap.html',
})
export class LocationmapPage {
  @ViewChild('map1') mapRef:ElementRef;
  map1: any;
   lat: number = 22.5726;
   lng: number = 88.3639;
   Destination:any;
   public order:any;
  MyLocation: any;
  responseData : any;
  public dbRef:any;
  markers = [];
  public myAddressList = [];
  public deliverylat:any;
  public deliverylong:any;
  public getFbPId:any;
  public currentFireUserId: string;
  public returnaddress:any;
  public localitymine:any;
  public form:FormGroup;
  public pos_code:any;
  public userId:any;
  public locationid:any;
  public subloc:any;
  public thoroughfare:any;
  public administrativeArea:any;
  watch : any;
  directionsService = new google.maps.DirectionsService;
   directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: false});
   GoogleMapsLatLng:any;
public LastLat:any;
public LastLng:any;
public address:any;
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private geolocation: Geolocation, 
    private afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public loadingCntrl:LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl:AlertController,
    public userService: Api,
    private builder:FormBuilder,
    private nativeGeocoder: NativeGeocoder
  ) {
      
    this.form = builder.group({  
      // 'mobileno': ['', Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(13),Validators.pattern('^[0-9]*$'),Validators.required])],
      // 'isd' : ['', Validators.compose([Validators.required,Validators.minLength(3),Validators.maxLength(3),Validators.pattern('^[0-9+]*$'),Validators.required])]
      'address': ['']
    });
    this.address = this.form.controls['address'];
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationmapPage');
    //this.locationid = this.navParams.get('loc_id');
    this.getShippingAddList();
    this.geolocation.getCurrentPosition().then((resp) => {
      let loading = this.loadingCntrl.create({
        content: 'Fetching your location...'
      });
      loading.present();
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.DisplayMap(this.lat,this.lng);
      loading.dismiss();
    }).catch((error) => {
      //console.log('Error getting location', error);
    });
   // this.DisplayMap(22.5726,88.3639);

  }

  getShippingAddList(){
    let userDetailsJson:any = localStorage.getItem('userPrfDet');
    userDetailsJson = JSON.parse(userDetailsJson);
    this.userId = userDetailsJson.id;
    this.userService.postData({"user_id":this.userId},'users/get_shipping_addresses').then((result:any) => {
      if(result.Ack == 1){
        //this.myAddressList = result.shipping_list;
        if(result.shipping_list.length >0){
          this.myAddressList[0]=result.shipping_list[0];
          this.locationid=this.myAddressList[0].id;
        }
      }
    }, (err) => {
    
    }); 
  }
  // initMap() {
  //   let loading = this.loadingCntrl.create({
  //     content: 'Fetching your location...'
  //   });
  //   loading.present();
  //   this.map1 = new google.maps.Map(document.getElementById('map1'), {
  //     zoom: 20,
  //     center: {lat: this.lat, lng: this.lng}
  //   });
  //   this.directionsDisplay.setMap(this.map1);
  //   loading.dismiss();
  // }

  DisplayMap(lat,lng) {
   
    //alert(lat);
        const location = new google.maps.LatLng(lat,
          lng);
        this.map1 = new google.maps.Map(document.getElementById('map1'), {
          zoom: 15,
          center: {lat: this.lat, lng: this.lng},
          streetViewControl:false,
          mapTypeId:'roadmap'
        });
        let marker = new google.maps.Marker({
          position:location,
          map:this.map1,
          animation: google.maps.Animation.DROP,
          draggable: true
        });
       this.lastLatLng(marker);
       
      }
    
      lastLatLng(marker){
        google.maps.event.addListener(marker, 'dragend', () =>{ 
        this.LastLat= marker.position.lat();
        this.LastLng= marker.position.lng();
        console.log("LATTTT",this.LastLat);
        console.log("LONGGG",this.LastLng);

        this.nativeGeocoder.reverseGeocode(this.LastLat,this.LastLng)
        .then((result: NativeGeocoderReverseResult[]) => {console.log(result[0])
          this.returnaddress=result[0].locality ? result[0].locality : '';
          this.localitymine=result[0].subAdministrativeArea ? result[0].subAdministrativeArea :'';
          this.pos_code=result[0].postalCode ? result[0].postalCode :'';
          this.administrativeArea=result[0].administrativeArea ? result[0].administrativeArea :'';
          this.subloc=result[0].subLocality ? result[0].subLocality :'' ;
          this.thoroughfare=result[0].thoroughfare ? result[0].thoroughfare  : '';
          

//console.log("GHYUUJUUU",this.returnaddress.toString()+this.localitymine.toString());     
         // console.log("ZIPCODEEEE",this.pos_code);
         if(this.thoroughfare && this.localitymine){
          this.form.controls['address'].setValue(this.thoroughfare+','+this.returnaddress+','+this.localitymine+','+this.administrativeArea);
         }else if(this.subloc){
          this.form.controls['address'].setValue(this.subloc+','+this.returnaddress+','+this.localitymine+','+this.administrativeArea);
         }     
         else{
          this.form.controls['address'].setValue(this.returnaddress+','+this.administrativeArea);
         }
         

         let alert = this.alertCtrl.create({
          title: 'Change Address',
          message: 'Do you want to save this?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'OK',
              handler: () => {
                this.updateShippingData(this.returnaddress,this.thoroughfare,this.subloc,this.administrativeArea,this.localitymine,this.pos_code,this.LastLat,this.LastLng)
              }
            }
          ]
        });
        alert.present();


        // this.updateShippingData(this.returnaddress, this.localitymine,this.pos_code,this.LastLat,this.LastLng);
 })
       
      });
      } 
      
      
  
  updateShippingData(returnaddress,thoroughfare,subloc,administrativeArea,localitymine,pos_code,lat,lng){
    let userDetailsJson:any = localStorage.getItem('userPrfDet');
    userDetailsJson = JSON.parse(userDetailsJson);
    this.userId = userDetailsJson.id;
  if(thoroughfare && localitymine){
    let param={
      "id":this.locationid,
      "user_id":this.userId,
      "address":thoroughfare+','+localitymine+','+returnaddress+','+administrativeArea,
      "zip":pos_code,
      "lati":lat,
      "logni":lng
    }

    this.userService.postData(param,'users/shipping_address_edit').then((result:any) => {
      if(result.Ack ==1){
        let toast = this.toastCtrl.create({
          message: result.msg,
          duration: 4000,
          position: 'top'
        });
        toast.present();
       // this.isEditFrm = false;
       this.navCtrl.pop();
        //this.getShippingAddList();
      }else{
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Something wrong.Please try again.' ,
          buttons: ['Ok']
        });
        alert.present();
      }
    }, (err) => {
      
    });
  }else if(subloc){
    let param={
      "id":this.locationid,
      "user_id":this.userId,
      "address":subloc+','+localitymine+','+returnaddress+','+administrativeArea,
      "zip":pos_code,
      "lati":lat,
      "logni":lng
    }

    this.userService.postData(param,'users/shipping_address_edit').then((result:any) => {
      if(result.Ack ==1){
        let toast = this.toastCtrl.create({
          message: result.msg,
          duration: 4000,
          position: 'top'
        });
        toast.present();
       // this.isEditFrm = false;
       this.navCtrl.pop();
        //this.getShippingAddList();
      }else{
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Something wrong.Please try again.' ,
          buttons: ['Ok']
        });
        alert.present();
      }
    }, (err) => {
      
    });

  }else{

    let param={
      "id":this.locationid,
      "user_id":this.userId,
      "address":returnaddress+','+administrativeArea,
      "zip":pos_code,
      "lati":lat,
      "logni":lng
    }

    this.userService.postData(param,'users/shipping_address_edit').then((result:any) => {
      if(result.Ack ==1){
        let toast = this.toastCtrl.create({
          message: result.msg,
          duration: 4000,
          position: 'top'
        });
        toast.present();
       // this.isEditFrm = false;
       this.navCtrl.pop();
        //this.getShippingAddList();
      }else{
        let alert = this.alertCtrl.create({
          title: 'Error!',
          subTitle: 'Something wrong.Please try again.' ,
          buttons: ['Ok']
        });
        alert.present();
      }
    }, (err) => {
      
    });
  }
   
  }

      getaddress(value){

      }

    

}
