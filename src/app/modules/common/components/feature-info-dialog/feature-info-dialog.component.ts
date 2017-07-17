import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { MdSnackBar } from '@angular/material';
import * as ol from 'openlayers';
import { Subject } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-feature-info-dialog',
  templateUrl: './feature-info-dialog.component.html',
  styleUrls: ['./feature-info-dialog.component.css']
})
export class FeatureInfoDialogComponent implements OnInit {

  userId;
  feature : ol.Feature;
  @Input('onFeatureDeleted') onFeatureDeleted : Subject<any> = new Subject();


  constructor(
    private db : AngularFireDatabase,
    private snackbar : MdSnackBar
  ) { }

  ngOnInit() {
    //console.log('[FEATURE INFO DIALOG] ::: ', this.feature.getProperties(), this.userId)
  }

  deleteFeature(){
    this.db.database
      .ref('messages')
      .child(this.feature.getProperties().userInfo.$key)
      .child(this.feature.getId().toString())
      .remove()
      .then( ()=> {
        this.onFeatureDeleted.next();
        this.snackbar.open('¡Eliminado correctamente!', 'CERRAR', { duration : 1000 })
      });
  }

  getDate(){
    return moment(this.feature.getProperties().timestamp).locale('es').fromNow();
  }

}
