import { Component, OnInit } from '@angular/core';
import * as ol from 'openlayers';

@Component({
  selector: 'app-map-firebase-dialog',
  templateUrl: './map-firebase-dialog.component.html',
  styleUrls: ['./map-firebase-dialog.component.css']
})
export class MapFirebaseDialogComponent implements OnInit {

  geohash : string;

  constructor() { }

  ngOnInit() {
  }

}
