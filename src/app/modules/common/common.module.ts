import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@angular/material';

import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


import { 
    MapComponent
  , ProjectionPickerComponent
  , AuthFirebaseComponent
  , DrawMapFirebaseComponent
  , MapFirebaseDialogComponent
} from './components';


const COMMON_COMPONENTS = [
    MapComponent
  , ProjectionPickerComponent
  , AuthFirebaseComponent
  , DrawMapFirebaseComponent
]

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  declarations: [MapFirebaseDialogComponent, ...COMMON_COMPONENTS],
  exports : COMMON_COMPONENTS,
  entryComponents : [MapFirebaseDialogComponent]
})
export class MyCommonModule { }