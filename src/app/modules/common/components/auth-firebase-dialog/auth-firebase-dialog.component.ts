import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { MdDialogRef } from '@angular/material';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-auth-firebase-dialog',
  templateUrl: './auth-firebase-dialog.component.html',
  styleUrls: ['./auth-firebase-dialog.component.css']
})
export class AuthFirebaseDialogComponent implements OnInit {

  constructor(
    private firebaseAuth : AngularFireAuth,
    private firebaseDatabase : AngularFireDatabase,
    private dialogRef : MdDialogRef<AuthFirebaseDialogComponent>
  ) { }

  ngOnInit() {
    //this.createUser('joherro10000@topo.upv.es', 'bbb123', 'ccc')
  }


  async signIn(provider : string, email ? : string, password ? : string){
    let promise : firebase.Promise<any>;
    switch(provider){
      case 'google': 
        promise = this.firebaseAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider() );
        break;
      case 'github' : 
        promise = this.firebaseAuth.auth.signInWithPopup( new firebase.auth.GithubAuthProvider() );
        break;
      case 'anonymous' :
        promise = this.firebaseAuth.auth.signInAnonymously();
        break;
      default :
        promise = Promise.reject('Provider no válido');
    }

    try {
      await promise;
    } catch(e){
      console.log(e);
    } finally {
      this.dialogRef.close();
    }
  }

}
