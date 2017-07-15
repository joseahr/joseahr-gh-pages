import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureInfoDialogComponent } from './feature-info-dialog.component';

describe('FeatureInfoDialogComponent', () => {
  let component: FeatureInfoDialogComponent;
  let fixture: ComponentFixture<FeatureInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeatureInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
