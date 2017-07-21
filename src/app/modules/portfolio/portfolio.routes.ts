import { Route } from '@angular/router'

import { PortfolioHomeComponent } from './portfolio-home/portfolio-home.component';
import { PortfolioMdViewComponent } from './portfolio-md-view/portfolio-md-view.component';


export const PORTFOLIO_ROUTES =  [
    { path : '', component : PortfolioHomeComponent },
    { path : ':id', component : PortfolioMdViewComponent },
    { path : '**', component : PortfolioHomeComponent },
]