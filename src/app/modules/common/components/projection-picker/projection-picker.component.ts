import { Component, OnInit, Input } from '@angular/core';

import * as ol from 'openlayers';
import * as proj4x from 'proj4';
const proj4 = (proj4x as any).default;
ol.proj.setProj4(proj4);

import { ProjectionService } from '../../services';


@Component({
  selector: 'app-projection-picker',
  templateUrl: './projection-picker.component.html',
  styleUrls: ['./projection-picker.component.css'],
  providers : [ProjectionService]
})
export class ProjectionPickerComponent implements OnInit {

  @Input('map') olMap : ol.Map;

  projectionToSearch : string = '';

  pointerMoveCoords : ol.Coordinate;
  projection : ol.proj.Projection = ol.proj.get('EPSG:3857');

  constructor(
    private projService : ProjectionService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    this.olMap.on('pointermove', (e : ol.MapBrowserEvent)=>{
      this.pointerMoveCoords = ol.proj.transform( e.coordinate
                                                , this.olMap.getView().getProjection()
                                                , this.projection );
    });

    this
      .olMap
      .getTargetElement()
      .addEventListener('mouseleave', ()=> this.pointerMoveCoords = null );
  }

  searchProjection(){
    this.projService.findProjection(this.projectionToSearch).subscribe(
      (projDef : string)=> {
        console.log('wayy', projDef);
        this.setMapProjection(this.projectionToSearch, projDef);
      },
      (err) => console.log(err)
    );
  }

  setMapProjection(epsg : number | string, projDef : string){
    proj4.defs(`EPSG:${epsg}`, projDef);
    
    let projection = ol.proj.get(`EPSG:${epsg}`);


    let fromLonLat = ol.proj.getTransform('EPSG:4326', projection);

    var extent = ol.extent.applyTransform([-180, -90, 180, 90], fromLonLat);
    projection.setExtent(extent);

    console.log(projection.getUnits())

    console.log(projection)

    this.projection = projection;

    this.projectionToSearch = '';

    /*let zoom = this.olMap.getView().getZoom();
    let center = ol.proj.transform(
        this.olMap.getView().getCenter()
      , this.olMap.getView().getProjection()
      , projection);

    console.log(center)

    let view = new ol.View({ projection, zoom, center });
    this.olMap.setView(view);*/
  }

}