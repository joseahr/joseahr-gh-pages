import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawMapFirebaseComponent } from './draw-map-firebase.component';

describe('DrawMapFirebaseComponent', () => {
  let component: DrawMapFirebaseComponent;
  let fixture: ComponentFixture<DrawMapFirebaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawMapFirebaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawMapFirebaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
