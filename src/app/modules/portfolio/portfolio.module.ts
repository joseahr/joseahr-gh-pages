import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PORTFOLIO_ROUTES } from './portfolio.routes';
import { PortfolioHomeComponent } from './portfolio-home/portfolio-home.component';
import { MarkdownModule } from 'angular2-markdown';
import { PortfolioMdViewComponent } from './portfolio-md-view/portfolio-md-view.component';
import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    MarkdownModule,
    RouterModule.forChild(PORTFOLIO_ROUTES)
  ],
  declarations: [PortfolioHomeComponent, PortfolioMdViewComponent]
})
export class PortfolioModule { }
