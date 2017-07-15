import { Route } from '@angular/router'

import { ViewComponent } from './view/view.component'

export const MAP_ROUTES =  [
    { path : '', component : ViewComponent },
    { path : '**', component : ViewComponent },
]