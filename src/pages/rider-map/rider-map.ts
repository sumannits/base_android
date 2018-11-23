import { Component ,ViewChild,ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController,AlertController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
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

/**
 * Generated class for the RiderMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-rider-map',
  templateUrl: 'rider-map.html',
})
export class RiderMapPage {
//  @ViewChild('map') mapElement: ElementRef;
 // maprider: any;
 @ViewChild('map1') mapElement: ElementRef;
 map1: any;
  lat: number = 22.5726;
  lng: number = 88.3639;
  Destination:any;
  public order:any;
 MyLocation: any;
 responseData : any;
 public dbRef:any;
 markers = [];
 public deliverylat:any;
 public deliverylong:any;
 public getFbPId:any;
 public currentFireUserId: string;
 watch : any;
 directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: false});
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private geolocation: Geolocation, 
    private afAuth: AngularFireAuth,
    public db: AngularFirestore,
    public loadingCntrl:LoadingController,
    public alertCtrl:AlertController
  ) {
    this.order=this.navParams.get('order_id');
    // this.afAuth.authState.do(user => {
    //   if (user) {
    //     this.currentFireUserId = user.uid;
    //     //console.log(this.currentFireUserId);
    //     //this.updateTrackData();
    //   }
    // }).subscribe();
    //console.log(this.afAuth.authState);
    //this.getgeolocationchanges();
    
  }

  ionViewDidLoad() {
    this.order=this.navParams.get('order_id');
    this.deliverylat=this.navParams.get('Latitude');
    this.deliverylong=this.navParams.get('Lognitude');
    //console.log('DELIVERYLATTTTTTT',  this.deliverylat);
    this.geolocation.getCurrentPosition().then((resp) => {
      this.lat = resp.coords.latitude;
      this.lng = resp.coords.longitude;
      this.initMap();
    }).catch((error) => {
      //console.log('Error getting location', error);
    });
    this.watch = this.geolocation.watchPosition();
      this.watch.subscribe((data) => {
        this.lat = data.coords.latitude; this.lng = data.coords.longitude;
       // this.gotodropoff();
       this.updateTrackData(this.order, data.coords.latitude,data.coords.longitude);
       this.calculateAndDisplayRoute();
    });

  }

  private updateTrackData(orderId, locLat, locLong) {
    this.calculateAndDisplayRoute();
    let usersRef = firebase.database().ref('geolocations/' + orderId);
    let connectedRef = firebase.database().ref('.info/connected');
    //const orderId = this.order;
    connectedRef.on('value', function (snapshot) {
      if (snapshot.val()) {
        usersRef.set({ longitude: locLong, latitude: locLat, order_id: orderId });
        //console.log('online');
      } else {
       
        usersRef.set({ longitude: locLong, latitude: locLat, order_id: orderId });
      }
    });
  }

  getgeolocationchanges(){
    //console.log('hi');
    const getFBId = this.db.collection('geolocations', ref => { 
      return ref.where('order_id', '==', this.order);
    }).snapshotChanges().map(actions => { 
      return actions.map(action => { 
        const data1 = action.payload.doc.data();
        const id = action.payload.doc.id;
        //console.log(data1);
        return { id, ...data1 };
      });
    });

    getFBId.subscribe(data => {  
      if(data.length>0){
        this.getFbPId = data[0].id;
        //console.log(data);
      } 
    });

  }

  initMap() {
    let loading = this.loadingCntrl.create({
      content: 'Fetching your location...'
    });
    loading.present();
    this.map1 = new google.maps.Map(document.getElementById('map1'), {
      zoom: 20,
      center: {lat: this.lat, lng: this.lng}
    });
    this.directionsDisplay.setMap(this.map1);
    loading.dismiss();
  }

 
  // addMarker(location,image) {
  //   // let image = {
  //   //   MyLocation: new google.maps.MarkerImage(
  //   //    'assets/img/mapicon.png'
  //   //   ),
  //   //   Destination: new google.maps.MarkerImage(
  //   //    'assets/img/blue-dot.png'
  //   //   )
  //   //  };
  //   let marker = new google.maps.Marker({
  //     position: location,
  //     map: this.maprider,
  //     icon: image
  //   });
  //   this.markers.push(marker);
  // }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  navigate(){
    this.map1 = new google.maps.Map(document.getElementById('map1'), {
      zoom: 20,
      center: {lat: this.lat, lng: this.lng}
    });
    this.directionsDisplay.setMap(this.map1);
  }

  calculateAndDisplayRoute() {
  
    // let image = {
    //   MyLocation: new google.maps.MarkerImage(
    //    'assets/img/mapicon.png'
    //   ),
    //   Destination: new google.maps.MarkerImage(
    //    'assets/img/blue-dot.png'
    //   )
    //  };
    let pos = {
      lat: this.lat,
      lng: this.lng
    };
    //console.log("&&YGHDYDSGYSFGS^F^SWF",pos);
    const MyLocation = new google.maps.LatLng(pos);
    let posstore = {
      lat: this.deliverylat,
      lng:this.deliverylong
    };
    const Destination = new google.maps.LatLng(posstore);
    this.directionsService.route({
      origin: MyLocation,
      destination: Destination,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.directionsDisplay.setDirections(response);
        var leg = response.routes[ 0 ].legs[ 0 ];
        //this.makeMarker( leg.start_location, image.MyLocation);
        //this.makeMarker( leg.end_location, image.Destination);
      } else {
        let alert = this.alertCtrl.create({
          title: 'Failed',
          subTitle: 'Directions request failed due to ' + status,
          buttons: ['Dismiss']
        });
        alert.present();
      }
    });
   
}

makeMarker(position,icon) {
  new google.maps.Marker({
   position: position,
   map: this.map1,
   icon: icon
  });
}
  

}