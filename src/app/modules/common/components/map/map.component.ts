import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import * as ol from 'openlayers';

import * as GeoHash from 'latlon-geohash';

import { trigger, state, style, transition, animate } from '@angular/animations';

import { MdDialog, MdDialogRef } from '@angular/material';
import { MapFirebaseDialogComponent } from '..';

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
        transform : 'translateY(-1000px) scale(0.6)',
        visibility : 'hidden'
      })),
      transition('logged => notLogged', animate('300ms ease-in')),
      transition('notLogged => logged', animate('300ms ease-in'))
    ])
  ]
})
export class MapComponent implements OnInit {

  observableFeatureList : Observable<any>;
  user : Observable<any>;
  backdropAnimationState : string = 'logged';
  onMapClickListener : any;
  userMessages : FirebaseListObservable<any>;
  mapInstance : ol.Map;
  firebaseLayer : ol.layer.Vector = new ol.layer.Vector({ source : new ol.source.Vector() });

  constructor(
      private auth : AngularFireAuth
    , private db : AngularFireDatabase
    , private mapFirebaseDialog : MdDialog
    , private mapContainer : ElementRef
    , private renderer : Renderer2
  ) {
    
    this.user = this.auth.authState
      .do( user =>{
        if(user){
          this.backdropAnimationState = 'logged';
          this.enableDraw();
          this.userMessages = this.db.list('/messages/' + user.uid);
        } else {
          this.backdropAnimationState = 'notLogged';
          this.disableDraw();
        }
      });

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

    this.observableFeatureList.subscribe(
      (list)=>console.log('orderedlist', list)
    )
  }

  ngOnInit() {
    this.renderer.setStyle(this.mapContainer.nativeElement, 'width', '100%');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'height'   , '100%');

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
      controls : ol.control.defaults().extend([new ol.control.MousePosition()])
    })

    //this.renderer.setStyle(this.mapContainer.nativeElement, 'background', '#f7f7f7');
    this.user.subscribe()
    this.observableFeatureList.subscribe();
  }

  getInstance(){
    return this.mapInstance;
  }

  enableDraw(){
    if(this.onMapClickListener){
      ol.Observable.unByKey(this.onMapClickListener);
    }

    this.onMapClickListener = this.mapInstance.on('dblclick', this.onMapClick.bind(this))
  }

  disableDraw(){
    if(this.onMapClickListener){
      ol.Observable.unByKey(this.onMapClickListener);
    }

    this.onMapClickListener = null;
  }


  onMapClick(event : ol.MapBrowserEvent){
    console.log(event.coordinate);

    // Nos aseguramos que las coordenadas estén en EPSG:4326
    let coordinate = ol.proj.transform(event.coordinate
                                      , this.mapInstance.getView().getProjection()
                                      , 'EPSG:4326');

    let geohash = GeoHash.encode(...coordinate.reverse(), 11);
                            
    console.log(geohash, GeoHash.decode(geohash));

    let dialog = this.mapFirebaseDialog.open(MapFirebaseDialogComponent);
        dialog.componentInstance.geohash = geohash;
    
    dialog.afterClosed().subscribe(
      ()=> this.userMessages.push({ geohash })
    )
  }

}
