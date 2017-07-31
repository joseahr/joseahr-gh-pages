import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';

@Pipe({name: 'sliceObservableList'})
export class SliceObservableListPipe implements PipeTransform {
  transform(value: Observable<Array<any>>, start: number = 0, end : number): Observable<Array<any>> {
    console.log(start, end, 'startend')
    return value.map(
        (list)=> {
            console.log(list, 'lllllist')
            return list.slice(start, end)
        }
    )
  }
}