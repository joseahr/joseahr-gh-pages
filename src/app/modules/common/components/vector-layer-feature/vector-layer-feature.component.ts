import { Component, OnInit, OnDestroy, OnChanges, Input, SimpleChanges } from '@angular/core';
import { Feature, layer, Coordinate, geom } from 'openlayers';

@Component({
  selector: 'app-vector-layer-feature',
  templateUrl: './vector-layer-feature.component.html',
  styleUrls: ['./vector-layer-feature.component.css']
})
export class VectorLayerFeatureComponent implements OnInit {
  public instance: Feature;

  @Input() id: string|number|undefined;
  @Input() layer : layer.Vector;
  @Input() coordinate : Coordinate;
  @Input() properties : any;

  constructor() {
  }

  ngOnInit() {
    this.instance = new Feature();
    if (this.id !== undefined) {
      this.instance.setId(this.id);
    }

    if(this.properties){
      this.instance.setProperties(this.properties);
    }

    this.instance.setGeometry(
      new geom.Point(this.coordinate)
    );

    this.layer.getSource().addFeature(this.instance);
  }

  ngAfterViewInit(){
  }

  ngOnDestroy() {
    this.layer.getSource().removeFeature(this.instance);
  }

  ngOnChanges(changes: SimpleChanges) {
    //console.log(changes)
    if (this.instance) {
      this.instance.setId(this.id);
      this.instance.setGeometry(
        new geom.Point(this.coordinate)
      );

      this.instance.setProperties(this.properties)
    }

  }
}
