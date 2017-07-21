import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import * as items from '../portfolio.items.json';
import { MarkdownService, MarkdownComponent } from 'angular2-markdown';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-portfolio-md-view',
  templateUrl: './portfolio-md-view.component.html',
  styleUrls: ['./portfolio-md-view.component.css'],
  providers : [MarkdownService],
  animations : [
    trigger('buttonScrollUp', [
      state('visible', style({
        transform : 'translateY(0px) scale(1)',
        opacity : '1'
      })),
      state('notVisible', style({
        transform : 'translateY(-20px) translateX(-100px) scale(0.6)',
        opacity : '0'
      })),
      transition('visible => notVisible', animate('300ms ease')),
      transition('notVisible => visible', animate('300ms ease'))
    ])
  ]
})
export class PortfolioMdViewComponent implements OnInit {

  url : string;
  showButtonUp : string = 'notVisible';
  

  constructor(
    private route : ActivatedRoute,
    private element : ElementRef, 
    private renderer : Renderer2,
    private location : Location,
    private markdownService : MarkdownService
  ) {

    this.renderer.setStyle(element.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(element.nativeElement, 'width', '100%');
    this.renderer.setStyle(element.nativeElement, 'top', '0');
    this.renderer.setStyle(element.nativeElement, 'left', '0');
    this.renderer.setStyle(element.nativeElement, 'bottom', '0');
    this.renderer.setStyle(element.nativeElement, 'overflow-y', 'auto');

    this.element.nativeElement.addEventListener('scroll', (event)=>{
      //console.log(event, event.target);
      this.showButtonUp = event.target.scrollTop > 20 ? 'visible' : 'notVisible';
    });

    let { id } = this.route.snapshot.params;
    this.url = (<any> items).find( item => item.id == id ).markdown_url;

    //console.log(this.url, this.route.snapshot.params);
  }


  ngOnInit() {

    this.markdownService.renderer.image = (data) =>{
      //console.log(data);
      return  `<p style="text-align : center;"><img src="${data}" style="max-width : 90%"></p>`
    }

    this.markdownService.renderer.link = (href : string, title, text) => {
      //console.log(href, title, text);
      if(href.startsWith('#')){
        // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript
        let id = href.substring(1) //.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        console.log('Id', id)
        return `<a href="javascript:void(0)" onclick="(function (){console.log('clicked'); document.getElementById('${id}').scrollIntoView()})()">${text}</a>`
      } else {
        return `<a href="${href}">${text}</a>`
      }
    }

    this.markdownService.renderer.heading = (text : string, level) => 
      `<h1 id="${text.toLowerCase().replace(/ /g, '-').replace(/[?¿]/g, '')}">${text}</h1>`;
  }

  goBack(){
    this.location.back();
  }

  scrollToTop(){
    this.element.nativeElement.scrollTo(0, 0);
  }

}
