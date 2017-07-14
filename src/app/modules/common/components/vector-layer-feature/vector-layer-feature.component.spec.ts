import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VectorLayerFeatureComponent } from './vector-layer-feature.component';

describe('VectorLayerFeatureComponent', () => {
  let component: VectorLayerFeatureComponent;
  let fixture: ComponentFixture<VectorLayerFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VectorLayerFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VectorLayerFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
