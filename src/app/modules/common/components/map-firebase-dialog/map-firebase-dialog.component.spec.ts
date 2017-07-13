import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapFirebaseDialogComponent } from './map-firebase-dialog.component';

describe('MapFirebaseDialogComponent', () => {
  let component: MapFirebaseDialogComponent;
  let fixture: ComponentFixture<MapFirebaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapFirebaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapFirebaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
