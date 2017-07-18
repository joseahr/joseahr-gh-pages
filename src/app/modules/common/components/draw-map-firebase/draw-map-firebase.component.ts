import { Component, OnInit, Renderer2, ElementRef, Input, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MdSnackBar, MdDialog, MdDialogRef } from '@angular/material';
import { MapFirebaseDialogComponent } from '..';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as ol from 'openlayers';
import { AngularFireAuth } from 'angularfire2/auth';
import * as GeoHash from 'latlon-geohash';
import 'rxjs/add/operator/toPromise';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-draw-map-firebase',
  templateUrl: './draw-map-firebase.component.html',
  styleUrls: ['./draw-map-firebase.component.css'],
  animations : [
    trigger('buttonEnableDrawAnimation', [
      state('visible', style({
        transform : 'translateY(20px) scale(1)',
        opacity : '1'
      })),
      state('notVisible', style({
        transform : 'translateY(0px) translateX(-100px) scale(0.6)',
        opacity : '0'
      })),
      transition('visible => notVisible', animate('300ms ease')),
      transition('notVisible => visible', animate('300ms ease'))
    ])
  ]
})
export class DrawMapFirebaseComponent implements OnInit {

  buttonAuthState : string = 'notVisible';
  @Input('map') mapInstance : ol.Map;
  @Input('onDrawStart') onDrawStart : Subject<any>;
  @Input('onDrawEnd') onDrawEnd : Subject<any>


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
    this.renderer.setStyle(this.element.nativeElement, 'left', '0px');
    this.renderer.setStyle(this.element.nativeElement, 'right', '0px');
    this.renderer.setStyle(this.element.nativeElement, 'display', 'flex');
    this.renderer.setStyle(this.element.nativeElement, 'height', '0px');

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
    this.onDrawStart.next();
    this.snackbar.open(`Selecciona un punto en el mapa`, 'CANCELAR');

    this.snackbar._openedSnackBarRef.onAction().subscribe(
      ()=>{
        //console.log('onAction');
        this.onDrawEnd.next();
        ol.Observable.unByKey(this.mapClickListener);
        this.mapClickListener = null;
        this.buttonAuthState = 'visible';
      }
    );

    this.mapClickListener = this.mapInstance.on('click', (e : ol.MapBrowserEvent)=> {

      let geohash = this.getGeoHash(e.coordinate);

      let dialogRef = this.dialog.open(MapFirebaseDialogComponent);

      dialogRef.afterClosed().subscribe(
        (message)=>{
          if(!message) {
            return;
          };

          let timestamp = new Date().getTime();

          //console.log('DialogExit');

          this.onDrawEnd.next();
          ol.Observable.unByKey(this.mapClickListener);
          this.mapClickListener = null;

          ( this.snackbar._openedSnackBarRef && this.snackbar._openedSnackBarRef.dismiss() );

          this
          .userMessages
          .push({ geohash, message, timestamp })
          .then( ()=>{
            return this
            .snackbar
            .open('Guardado correctamente', 'CERRAR', { duration : 1000 })
            .afterDismissed()
            .toPromise();
          }).then( ()=> this.buttonAuthState = 'visible' );
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
