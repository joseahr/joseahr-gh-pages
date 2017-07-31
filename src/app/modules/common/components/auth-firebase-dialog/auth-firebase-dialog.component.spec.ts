import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFirebaseDialogComponent } from './auth-firebase-dialog.component';

describe('AuthFirebaseDialogComponent', () => {
  let component: AuthFirebaseDialogComponent;
  let fixture: ComponentFixture<AuthFirebaseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthFirebaseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthFirebaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
