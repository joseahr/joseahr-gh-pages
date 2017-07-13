import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionPickerComponent } from './projection-picker.component';

describe('ProjectionPickerComponent', () => {
  let component: ProjectionPickerComponent;
  let fixture: ComponentFixture<ProjectionPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectionPickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
