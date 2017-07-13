import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()
export class ProjectionService {
  constructor(private http : Http){}

  findProjection( epsg : number | string ){
    return this.http.get(`https://epsg.io/${epsg}.proj4`).map( res => res.text() );
  }

}
