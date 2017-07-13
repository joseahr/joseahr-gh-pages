import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyCommonModule } from '..';
import { ViewComponent } from './view/view.component';

import { RouterModule } from '@angular/router';

import { MAP_ROUTES } from './map.routes';


@NgModule({
  imports: [
    CommonModule,
    MyCommonModule,
    RouterModule.forChild(MAP_ROUTES)
  ],
  declarations: [ViewComponent]
})
export class MapModule { }
