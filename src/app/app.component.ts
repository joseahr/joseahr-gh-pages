import { Component, ViewChild } from '@angular/core';
import { MdSidenav } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  //title = 'app';

  constructor(
  ){
  }

  @ViewChild(MdSidenav) sideNav : MdSidenav;

  isSideNavOpened() : boolean {
    return this.sideNav.opened;
  }

  toggleSideNav() {
    let isOpened = this.isSideNavOpened();

    if(isOpened){
      this.sideNav.close();
    } else {
      this.sideNav.open();
    }

  }

}