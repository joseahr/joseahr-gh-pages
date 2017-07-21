import { Component, OnInit, HostListener } from '@angular/core';

import * as items from '../portfolio.items.json';

@Component({
  selector: 'app-portfolio-home',
  templateUrl: './portfolio-home.component.html',
  styleUrls: ['./portfolio-home.component.css']
})
export class PortfolioHomeComponent implements OnInit {

  items = items;
  colspan : number = 1;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let width = event.target.innerWidth;

    this.colspan = (width > 600 ? 1 : 2);
    
  }

  constructor() {
    //console.log(this.items, 'items');
  }

  ngOnInit() {
    this.colspan = (window.innerWidth > 600 ? 1 : 2)
  }

}
