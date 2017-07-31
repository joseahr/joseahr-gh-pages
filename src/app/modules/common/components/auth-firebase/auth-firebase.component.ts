import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { MdDialog, MdDialogRef } from '@angular/material';
import { AuthFirebaseDialogComponent } from '..';

@Component({
  selector: 'app-auth-firebase',
  templateUrl: './auth-firebase.component.html',
  styleUrls: ['./auth-firebase.component.css']
})
export class AuthFirebaseComponent implements OnInit {

  user : Observable<firebase.User>;
  ANONYMOUS_USER_PHOTOURL = 'http://s.gravatar.com/avatar/d415f0e30c471dfdd9bc4f827329ef48?s=100&r=x&d=retro';

  constructor(
    private firebaseAuth : AngularFireAuth,
    private renderer : Renderer2, 
    private elementRef : ElementRef,
    private dialog : MdDialog
  ) {
    this.user = this.firebaseAuth.authState;
    this.renderer.setStyle(this.elementRef.nativeElement, 'line-height', '10px');
    /*this.user.subscribe(
      (user)=>{
      },
      (err)=>{ console.log('err', err)}
    );
    */
  }

  ngOnInit() {
  }

  logout(){
    this.firebaseAuth.auth.signOut();
  }

  openDialog(){
    let dialogRef = this.dialog.open(AuthFirebaseDialogComponent);
  }

}
