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

  constructor(
      private auth : AngularFireAuth
    , private db : AngularFireDatabase
    , private mapFirebaseDialog : MdDialog
    , private mapContainer : ElementRef
    , private renderer : Renderer2
  ) {
    
    this.user = this.auth.authState;

    this.observableFeatureList = 
      this.db.list('/messages')
        .do( list => {
          console.log(list);
        });

    this.observableFeatureList
      .subscribe(
        (list)=>console.log('lll', list),
        (err) => console.log(err)
      );
  }

  mapInstance : ol.Map;
  fireBaseLayer : ol.layer.Vector = new ol.layer.Vector({ source : new ol.source.Vector() });

  ngOnInit() {
    this.renderer.setStyle(this.mapContainer.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'top'   , '0px');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'left'  , '0px');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'right' , '0px');
    this.renderer.setStyle(this.mapContainer.nativeElement, 'bottom', '0px');

    this.mapInstance = new ol.Map({
      layers : [
        new ol.layer.Tile({ source : new ol.source.OSM({ reprojectionErrorThreshold : 10 }) }),
        this.fireBaseLayer
      ],
      target : this.mapContainer.nativeElement,
      view : new ol.View({
        center: [0, 0],
        zoom: 2
      }),
      controls : ol.control.defaults().extend([new ol.control.MousePosition()])
    })

    //this.renderer.setStyle(this.mapContainer.nativeElement, 'background', '#f7f7f7');
    this.user
      .do( user =>{
        if(user){
          this.backdropAnimationState = 'logged';
          this.enableDraw();
          this.userMessages = this.db.list('/messages/' + user.uid);
        } else {
          this.backdropAnimationState = 'notLogged';
          this.disableDraw();
        }
      }).subscribe()
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
