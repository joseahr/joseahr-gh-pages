import { Route } from '@angular/router'

import { HomeComponent } from './components'

export const APP_ROUTES =  [
    { path : '', component : HomeComponent },
    { path : 'map', loadChildren : './modules/map/map.module#MapModule' },
    { path : 'blog', component : HomeComponent },
    { path : 'portfolio', loadChildren : './modules/portfolio/portfolio.module#PortfolioModule' },
    { path : '**', redirectTo : '' }
]