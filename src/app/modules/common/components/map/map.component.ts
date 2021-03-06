import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { Observable } from 'rxjs';
import * as ol from 'openlayers';

import { MdDialog, MdDialogRef } from '@angular/material';
import { FeatureInfoDialogComponent } from '..';

import * as GeoHash from 'latlon-geohash';

import { trigger, state, style, transition, animate } from '@angular/animations';

import { Subject } from 'rxjs';

import { AuthFirebaseDialogComponent } from '..';
import { SliceObservableListPipe } from '../../pipes';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  animations : [
    trigger('notLoggedBackdropAnimation', [
      state('notLogged', style({
        transform : 'translateY(0px) scale(1)'
      })),
      state('logged', style({
        transform : 'translateY(-1000px) scale(0.6)'
      })),
      transition('logged => notLogged', animate('300ms ease-in')),
      transition('notLogged => logged', animate('300ms ease-in'))
    ])
  ]
})
export class MapComponent implements OnInit {

  observableFeatureList : Observable<any>;
  usersReference : Array<any>;
  user : Observable<any>;
  backdropAnimationState : string = 'logged';
  userMessages : FirebaseListObservable<any>;
  mapInstance : ol.Map;
  firebaseLayer : ol.layer.Vector = new ol.layer.Vector({ source : new ol.source.Vector() });
  pointerMoveListener : any;
  selectInteraction : ol.interaction.Select = new ol.interaction.Select(<any>{
      layers : [this.firebaseLayer],
      hitTolerance : 5
  });
  actualUser : firebase.User;
  onDrawStart : Subject<any> = new Subject();
  onDrawEnd : Subject<any> = new Subject();
  onDeleteFeature : Subject<any> = new Subject();
  onFeatureInfoDialogClose : Subject<any> = new Subject();
  MAX_FEATURES = 5;
  @ViewChild('featureInput') featureInput : ElementRef;

  constructor(
      private auth : AngularFireAuth
    , private db : AngularFireDatabase
    , private mapContainer : ElementRef
    , private renderer : Renderer2
    , private dialog : MdDialog
  ) {

    this.renderer.setStyle(this.mapContainer.nativeElement, 'width', '100%');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'top', '0');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'left', '0');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'bottom', '0');

    this.onDrawStart.subscribe( () => this.disableSelectFeatures() );
    this.onDrawEnd.subscribe( () => this.enableSelectFeatures() );
    this.onDeleteFeature.subscribe( ()=> this.selectInteraction.getFeatures().clear() );
    this.onFeatureInfoDialogClose.subscribe( ()=> this.selectInteraction.getFeatures().clear() );
    
    this.user = this.auth.authState
      .map( user =>{
        if(user){
          this.backdropAnimationState = 'logged';
          this.actualUser = user;
          this.enablePointerMove();
          this.enableSelectFeatures();
        } else {
          this.backdropAnimationState = 'notLogged';
          this.actualUser = null;
          this.disablePointerMove();
          this.disableSelectFeatures();
        }
      });

    //this.db.database.ref('/messages').limitToLast(50).on('value', (value)=>console.log('value', value))
    
    this.observableFeatureList = this.getFeatureListObservable();
      //.subscribe( e => console.log(e))


    /*
    this.observableFeatureList = this.db.list('/messages')
    .map( (list : any[])=> {

      //let firebaseLSource = this.fireBaseLayer.getSource();

      let result : any[] = list
      .reduce( (l : Array<any>, userMessages : any) => {

        let messages;
        let userId = userMessages['$key'];
        //console.log(userId, 'userIdd')

        //console.log(Object.keys(userMessages))

        let userMessagesList = Object.keys(userMessages).map( (messageId) => {
          let { geohash, message, timestamp } = userMessages[messageId];
          
          //let feature = firebaseLSource.getFeatureById(messageId);

          let { lon, lat } = GeoHash.decode(geohash);

          let coordinate = ol.proj.transform(  [lon, lat]
                                              , 'EPSG:4326'
                                              , this.mapInstance.getView().getProjection()  );
          return ({ userId, coordinate, messageId, message, timestamp });

        });

        return l.concat(userMessagesList);

      }, []);

      console.log(result, 'tree')

      return result.sort( (a, b)=> b.timestamp - a.timestamp).slice(0, 5);
      //console.log(list);
      //this.fireBaseLayer.getSource().getFeatureById()
    });
    */
  }

  ngOnInit() {

    this.mapInstance = new ol.Map({
      layers : [
        new ol.layer.Tile({ source : new ol.source.OSM() })
      ],
      target : this.mapContainer.nativeElement,
      view : new ol.View({
        center: [0, 0],
        zoom: 2
      }),
      controls : ol.control.defaults()
    });


    this.mapInstance.addLayer(this.firebaseLayer);

    //console.log(this.mapInstance.getLayers().getArray())

    this.mapInstance.addInteraction(this.selectInteraction);

    this.selectInteraction.on('select', this.onSelectFeature.bind(this))

    //this.renderer.setStyle(this.mapContainer.nativeElement, 'background', '#f7f7f7');
    this.user.subscribe()
    this.observableFeatureList.subscribe();

    let inputObservable = Observable.fromEvent(this.featureInput.nativeElement, 'input');

    inputObservable.map( ()=>{
      this.observableFeatureList = this.getFeatureListObservable();
    }).subscribe();

  }

  getInstance(){
    return this.mapInstance;
  }

  openLoginDialog(){
    this.dialog.open(AuthFirebaseDialogComponent);
  }

  enablePointerMove(){
    if(this.pointerMoveListener){
      return;
    }
    this.pointerMoveListener = this.mapInstance.on('pointermove', (e : ol.MapBrowserPointerEvent)=>{
      if(this.mapInstance.hasFeatureAtPixel(e.pixel)){
        document.body.style.cursor = 'pointer';
      } else {
        document.body.style.cursor = 'default';
      }
    })
  }

  disablePointerMove(){
    ol.Observable.unByKey(this.pointerMoveListener);
    this.pointerMoveListener = null;
  }

  hasSelectInteraction(){
    let selectInteraction = this.mapInstance
                              .getInteractions()
                              .getArray()
                              .find( i => i === this.selectInteraction );
    return selectInteraction != undefined;
  }

  enableSelectFeatures(){
    
    if(this.hasSelectInteraction()) return;

    this.mapInstance.addInteraction(this.selectInteraction);
  }

  disableSelectFeatures(){
    if(this.hasSelectInteraction){
      this.mapInstance.removeInteraction(this.selectInteraction);
    }
  }

  onSelectFeature(event){
    //console.log(event)
    let { selected } = event;
    if(selected.length){
      let feature : ol.Feature = selected[0];

      //console.log(feature.getProperties())

      let dialogRef = this.dialog.open(FeatureInfoDialogComponent);
        dialogRef.componentInstance.userId = this.actualUser.uid;
        dialogRef.componentInstance.feature = feature;
        dialogRef.componentInstance.onFeatureDeleted = this.onDeleteFeature;
        dialogRef.componentInstance.onDialogClose = this.onFeatureInfoDialogClose;
    }
  }

  getProperties(feature){
    //console.log('[getProperties]', feature);
    let { userId, message, timestamp } = feature;
    
    
    //if(timestamp) console.log(timestamp, 'tm')
    //console.log(message);

    let userInfo = this.usersReference.find( u => u.$key == userId );
    console.log(userInfo, 'UInfo')

    //console.log(userInfo)
    return { userInfo, message, timestamp };
  }


  getFeatureListObservable(){
    return this.db.list('/messages')
      .flatMap( (userList : any[]) => {
        //console.log(userList)
        let messages = userList.reduce( (arr : any[], userMessagesData)=>{
          let userId = userMessagesData.$key;
          let messageKeys = Object.keys(userMessagesData);
          let userMessages = messageKeys.map( key =>{
            userMessagesData[key].messageId = key;
            userMessagesData[key].userId = userId;
            return userMessagesData[key];
          });

          let userInfoPromise = this.db.database.ref('users').child(userId).once('value').then( snapshot => snapshot.val() );
          let dataObservable = Observable.of(userMessages);
          let userInfoObservable = Observable.fromPromise(userInfoPromise);
          let fullDataObservable = Observable.forkJoin(dataObservable, userInfoObservable);
          arr.push(fullDataObservable);
          return arr;
        }, []);
        

        return Observable.forkJoin(messages);


      })
      .map( (result : any) =>{
        console.log(result)
        return result.reduce( (messages, element : any[])=>{
          let [userMessages, userInfo]  = element;
          
          let { displayName, photoURL } = userInfo;
          //console.log(displayName, photoURL, 'userId')
          let usmsgs = userMessages.map( message_ => {
            let { geohash, message, timestamp, messageId, userId } = message_;
            let { lon, lat } = GeoHash.decode(geohash);
            let coordinate = ol.proj.transform(  [lon, lat]
                                                , 'EPSG:4326'
                                                , this.mapInstance.getView().getProjection()  );

            return ({ userId, coordinate, messageId, message, timestamp, displayName, photoURL });
          });
          return [...messages, ...usmsgs]
        }, [])
        .sort( (a, b)=> b.timestamp - a.timestamp)
      });
  }

}
