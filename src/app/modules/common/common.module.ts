import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '@angular/material';

import { FormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AsyncWritterDirective } from './directives';

import { SliceObservableListPipe } from './pipes';


import { 
    MapComponent
  , ProjectionPickerComponent
  , AuthFirebaseComponent
  , DrawMapFirebaseComponent
  , MapFirebaseDialogComponent
  , VectorLayerFeatureComponent
  , FeatureInfoDialogComponent
  , AuthFirebaseDialogComponent
} from './components';

const COMMON_COMPONENTS = [
    MapComponent
  , ProjectionPickerComponent
  , AuthFirebaseComponent
  , DrawMapFirebaseComponent
  , AsyncWritterDirective
]

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    AngularFireModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  declarations: [ ...COMMON_COMPONENTS
                , VectorLayerFeatureComponent
                , MapFirebaseDialogComponent
                , FeatureInfoDialogComponent
                , AuthFirebaseDialogComponent
                , SliceObservableListPipe
                ],
  exports : COMMON_COMPONENTS,
  entryComponents : [MapFirebaseDialogComponent, FeatureInfoDialogComponent, AuthFirebaseDialogComponent]
})
export class MyCommonModule { }
