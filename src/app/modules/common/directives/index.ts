import { Directive, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs';

@Directive({
  selector: '[async-writter]'
})
export class AsyncWritterDirective {
    text : string;
    infinite : boolean = false;

    constructor(
        private element : ElementRef
    ){}

    ngAfterContentInit(){
        this.text = this.element.nativeElement.innerHTML;
        this.element.nativeElement.innerHTML = '';
        this.write(this.text)
        .finally( ()=> console.log('Finished') )
        .subscribe(
            data => {
                this.element.nativeElement.textContent += data;
                //console.log(data);
            }
        );
    }

    randomDelay(bottom, top) {
        return Math.floor( Math.random() * ( 1 + top - bottom ) ) + bottom;
    }

    write(text){
        // creamos un array con cada elemento de la frase
        let count = -1;
        const source : Observable<any> = Observable.
        of(text)
        .flatMap(e => e[++count])
        .delay( this.randomDelay(50, 200) )
        .timeInterval()
        .repeat()
        .takeWhile( e => e.value != undefined )
        .map( e => e.value );
        
        return source;

    }
}