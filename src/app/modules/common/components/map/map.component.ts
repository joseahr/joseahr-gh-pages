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
  selectInteraction : ol.interaction.Select = new ol.interaction.Select(<any>{
      layers : [this.firebaseLayer],
      hitTolerance : 5
  });

  constructor(
      private auth : AngularFireAuth
    , private db : AngularFireDatabase
    , private mapContainer : ElementRef
    , private renderer : Renderer2
    , private dialog : MdDialog
  ) {
    
    this.user = this.auth.authState
      .do( user =>{
        if(user){
          this.backdropAnimationState = 'logged';
        } else {
          this.backdropAnimationState = 'notLogged';
        }
      });

    //this.db.database.ref('/messages').limitToLast(50).on('value', (value)=>console.log('value', value))

    this.db.list('/users').subscribe(
      (users)=>{
        this.usersReference = users;
        console.log(users);
      }
    );

    this.observableFeatureList = this.db.list('/messages')
      .map( (list : any[])=> {

        //let firebaseLSource = this.fireBaseLayer.getSource();

        return list
        .reduce( (l : Array<any>, userMessages : any) => {

          let messages;
          let userId = userMessages['$key'];
          //console.log(userId, 'userIdd')

          //console.log(Object.keys(userMessages))

          let userMessagesList = Object.keys(userMessages).map( (messageId) => {
            let { geohash } = userMessages[messageId];
            
            //let feature = firebaseLSource.getFeatureById(messageId);

            let { lon, lat }= GeoHash.decode(geohash);

            let coordinate = ol.proj.transform(  [lon, lat]
                                               , 'EPSG:4326'
                                               , this.mapInstance.getView().getProjection()  );
            return ({ userId, coordinate, messageId });

          });

          return l.concat(userMessagesList);

        }, []);
        //console.log(list);
        //this.fireBaseLayer.getSource().getFeatureById()
      });
  }

  ngOnInit() {
    this.renderer.setStyle(this.mapContainer.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'width'   , '100%');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'top'   , '0px');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'bottom'   , '0px');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'left'   , '0px');


    this.mapInstance = new ol.Map({
      layers : [
        new ol.layer.Tile({ source : new ol.source.OSM({ reprojectionErrorThreshold : 10 }) }),
        this.firebaseLayer
      ],
      target : this.mapContainer.nativeElement,
      view : new ol.View({
        center: [0, 0],
        zoom: 2
      }),
      controls : ol.control.defaults()
    });

    this.mapInstance.addInteraction(this.selectInteraction);

    this.selectInteraction.on('select', this.onSelectFeature.bind(this))

    //this.renderer.setStyle(this.mapContainer.nativeElement, 'background', '#f7f7f7');
    this.user.subscribe()
    this.observableFeatureList.subscribe();
  }

  getInstance(){
    return this.mapInstance;
  }

  onSelectFeature(event){
    console.log(event)
    let { selected } = event;
    if(selected.length){
      let feature : ol.Feature = selected[0];

      console.log(feature.getProperties())

      let dialogRef = this.dialog.open(FeatureInfoDialogComponent);
        dialogRef.componentInstance.properties = feature.getProperties()
        
    }
  }

  getProperties(feature){
    //console.log('[getProperties]', feature);
    let { userId } = feature;

    let userInfo = this.usersReference.find( u => u.$key == userId );

    //console.log(userInfo)
    return userInfo;
  }

}
