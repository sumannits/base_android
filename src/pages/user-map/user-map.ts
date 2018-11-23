import { Component ,ViewChild,ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
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

/**
 * Generated class for the UserMapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
declare var google;
@IonicPage()
@Component({
  selector: 'page-user-map',
  templateUrl: 'user-map.html',
})
export class UserMapPage {
  @ViewChild('map') mapElement: ElementRef;
  maprider: any;
  lat: number;
  lng: number;
  Destination:any;
  public order:any;
 MyLocation: any;
 responseData : any;
 public dbRef:any;
 markers = [];
 public getFbPId:any;
 public locations = [];
 public userLat:number;
 public userLong:number;

 constructor(public navCtrl: NavController, public navParams: NavParams, private geolocation: Geolocation, public db: AngularFirestore) {
  this.order=this.navParams.get('order_id');
  this.userLat=parseFloat(this.navParams.get('Latitude'));
  this.userLong=parseFloat(this.navParams.get('Lognitude'));
  //this.getgeolocationchanges();
}

  ionViewDidLoad() {
    this.order=this.navParams.get('order_id');
    this.updateTrackData(this.order);
    //console.log('ionViewDidLoad UserMapPage');
    this.initMap();
  }

  private updateTrackData(orderId) {
    let onlineUsersRef = firebase.database().ref('geolocations/'+ orderId);
    onlineUsersRef.on('value', (snapshot)=> {
      //console.log(snapshot.val());
    //  if (snapshot.val()){
      this.lat=snapshot.val().latitude;
      this.lng=snapshot.val().longitude;
      this.calculateAndDisplayRoute(this.lat,this.lng);
     // }
      // if (snapshot.val()) {
      // //  usersRef.set({ longitude: locLong, latitude: locLat, order_id: orderId });
      // console.log('onlineVALUUEE',snapshot);
      // } else {
       
      //   //usersRef.set({ longitude: locLong, latitude: locLat, order_id: orderId });
      // }
    });
  }

  initMap() {
    this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true }).then((resp) => {
      let mylocation = new google.maps.LatLng(resp.coords.latitude,resp.coords.longitude);
      this.maprider = new google.maps.Map(document.getElementById('map'), {
        zoom: 20,
        center: mylocation,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
    });
    this.getgeolocation(this.order);

    // let watch = this.geolocation.watchPosition();
    // watch.subscribe((data) => {
    //   //this.getgeolocationchanges();
    //   this.deleteMarkers();
    //   this.getgeolocation(this.order,data.coords.latitude,data.coords.longitude);
    //   let updatelocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
    //   this.calculateAndDisplayRoute(data.coords.latitude,data.coords.longitude);
    //   let image = 'assets/img/blue-dot.png';
    // this.addMarker(updatelocation,image);
    //   this.setMapOnAll(this.maprider);
    // });
  }

  addMarker(location,image) {
    // let image = {
    //   MyLocation: new google.maps.MarkerImage(
    //    'assets/img/mapicon.png'
    //   ),
    //   Destination: new google.maps.MarkerImage(
    //    'assets/img/blue-dot.png'
    //   )
    //  };
    let marker = new google.maps.Marker({
      position: location,
      map: this.maprider,
      icon: image
    });
    this.markers.push(marker);
  }

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

  getgeolocation(order_id){
    this.locations = [];
    const getFBId = this.db.collection('geolocations', ref => { 
      return ref.where('order_id', '==', order_id);
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
        let getData:any = data[0];
        this.locations.push(getData);
        
      }
      //console.log("LATTTTTTTTT",this.locations);
    });
    let image = 'assets/img/blue-dot.png';
 //   let updatelocation = new google.maps.LatLng(this.locations[0].latitude,this.locations[0].latitude);
  //  this.addMarker(updatelocation,image);
  //  console.log("LATTTTTTTTT",this.locations[0].latitude);
   // this.calculateAndDisplayRoute(this.locations[0].latitude,this.locations[0].latitude);
  } 

  calculateAndDisplayRoute(latt,longg) {
  
    let that = this;
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer();
  
    directionsDisplay.setMap(this.maprider);
        //console.log("CURRENTPOS",latt);
        //console.log("CURRENTPOS",longg);
       
        var pos = {
          lat:latt,
          lng: longg
        };
     
        this.maprider.setCenter(pos);
        that.MyLocation = new google.maps.LatLng(pos);
     
        var posstore={
          lat: this.userLat,
          lng:this.userLong
        };
        that.Destination=new google.maps.LatLng(posstore);
       
        directionsService.route({ origin: this.MyLocation,
         destination: this.Destination,
         travelMode: google.maps.TravelMode.DRIVING}, function(response, status) {
          //console.log("DIRECTIONN",response);
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          //  var leg = response.routes[ 0 ].legs[ 0 ];
          //   this.addMarker(leg.start_location,image.MyLocation);
          //   this.addMarker(leg.end_location,image.Destination);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
  }
}
