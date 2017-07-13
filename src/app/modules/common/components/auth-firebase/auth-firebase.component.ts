import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-firebase',
  templateUrl: './auth-firebase.component.html',
  styleUrls: ['./auth-firebase.component.css']
})
export class AuthFirebaseComponent implements OnInit {

  user : Observable<firebase.User>;

  constructor(
    private firebaseAuth : AngularFireAuth
  ) {
    this.user = this.firebaseAuth.authState;
    
    /*this.user.subscribe(
      (user)=>{
      },
      (err)=>{ console.log('err', err)}
    );*/
  }

  ngOnInit() {}

  login(){
    this.firebaseAuth.auth.signInWithPopup( new firebase.auth.GoogleAuthProvider() );
  }

  logout(){
    this.firebaseAuth.auth.signOut();
  }

}
