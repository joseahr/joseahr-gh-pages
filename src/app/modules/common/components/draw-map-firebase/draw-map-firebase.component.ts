import { Component, OnInit } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'app-draw-map-firebase',
  templateUrl: './draw-map-firebase.component.html',
  styleUrls: ['./draw-map-firebase.component.css']
})
export class DrawMapFirebaseComponent implements OnInit {

  constructor(
    private db : AngularFireDatabase
  ) { }

  ngOnInit() {
  }

}
