import { Component, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  constructor(
    private renderer : Renderer2,
    private elementRef : ElementRef
  ) {
    this.renderer.setStyle(this.elementRef.nativeElement, 'width', '100%');
    this.renderer.setStyle(this.elementRef.nativeElement, 'position', 'absolute');
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', '0');
    this.renderer.setStyle(this.elementRef.nativeElement, 'bottom', '0');
    this.renderer.setStyle(this.elementRef.nativeElement, 'left', '0');
  }

  ngOnInit() {
  }

}
