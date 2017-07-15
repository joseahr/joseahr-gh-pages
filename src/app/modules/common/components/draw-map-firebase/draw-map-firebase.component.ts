import { Component, OnInit, Renderer2, ElementRef, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { MapFirebaseDialogComponent } from '..';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as ol from 'openlayers';
import { AngularFireAuth } from 'angularfire2/auth';
import * as GeoHash from 'latlon-geohash';

@Component({
  selector: 'app-draw-map-firebase',
  templateUrl: './draw-map-firebase.component.html',
  styleUrls: ['./draw-map-firebase.component.css'],
  animations : [
    trigger('buttonEnableDrawAnimation', [
      state('visible', style({
        transform : 'translateY(20px) translateX(50vw) scale(1)'
      })),
      state('notVisible', style({
        transform : 'translateY(-1000px) translateX(50vw) scale(0.6)'
      })),
      transition('visible => notVisible', animate('300ms ease-in')),
      transition('notVisible => visible', animate('300ms ease-in'))
    ])
  ]
})
export class DrawMapFirebaseComponent implements OnInit {

  buttonAuthState : string = 'notVisible';
  @Input('map') mapInstance : ol.Map;
  mapClickListener : any;
  userMessages : FirebaseListObservable<any>;

  constructor(
    private db : AngularFireDatabase,
    private auth : AngularFireAuth,
    private element : ElementRef,
    private renderer : Renderer2,
    private snackbar : MdSnackBar,
    private dialog : MdDialog
  ) {

    this.renderer.setStyle(this.element.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.element.nativeElement, 'z-index', '1');

    this.auth.authState.subscribe(
      (user)=>{
        
        if(user){
          this.userMessages = this.db.list('/messages/' + user.uid);
        } else {
          (this.snackbar._openedSnackBarRef && this.snackbar._openedSnackBarRef.dismiss())
          ol.Observable.unByKey(this.mapClickListener);
          this.mapClickListener = null;
          this.buttonAuthState = 'notVisible';
        }

        this.toggleButton(user);
      
      }
    );
  }

  ngOnInit() {
  }

  toggleButton(authState){
    this.buttonAuthState = (authState ? 'visible' : 'notVisible');
  }

  onButtonClick(event){

    this.buttonAuthState = 'notVisible';
    this.snackbar.open(`Selecciona un punto en el mapa`, 'CANCELAR', {
      
    });
    this.snackbar._openedSnackBarRef.onAction().subscribe(
      ()=>{
        console.log('onAction')
        ol.Observable.unByKey(this.mapClickListener);
        this.mapClickListener = null;
        this.buttonAuthState = 'visible';
      }
    )  

    this.mapClickListener = this.mapInstance.once('click', (e : ol.MapBrowserEvent)=> {

      let geohash = this.getGeoHash(e.coordinate);

      let dialogRef = this.dialog.open(MapFirebaseDialogComponent);

      dialogRef.afterClosed().subscribe(
        ()=>{
          console.log('DialogExit');
          this.buttonAuthState = 'visible';
          ( this.snackbar._openedSnackBarRef && this.snackbar._openedSnackBarRef.dismiss() );
          this.userMessages.push({ geohash });
        }
      );

    });

  }

  getGeoHash(coordinate : ol.Coordinate){

    let coord = ol.proj.transform(  coordinate
                                  , this.mapInstance.getView().getProjection()
                                  , 'EPSG:4326'  );

    return GeoHash.encode(...coord.reverse(), 11);
  }

  ngOnDestroy(){
    ( this.snackbar._openedSnackBarRef && this.snackbar._openedSnackBarRef.dismiss() );
    ol.Observable.unByKey(this.mapClickListener);
    this.mapClickListener = null;
    this.buttonAuthState = 'notVisible';
  }

}
