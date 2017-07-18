import { Route } from '@angular/router'

import { PortfolioHomeComponent } from './portfolio-home/portfolio-home.component';

export const PORTFOLIO_ROUTES =  [
    { path : '', component : PortfolioHomeComponent },
    { path : ':id', component : PortfolioHomeComponent },
    { path : '**', component : PortfolioHomeComponent },
]