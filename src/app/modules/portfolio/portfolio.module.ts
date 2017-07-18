import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MyCommonModule } from '..';
import { PORTFOLIO_ROUTES } from './portfolio.routes';
import { PortfolioHomeComponent } from './portfolio-home/portfolio-home.component';
import { MarkdownModule } from 'angular2-markdown';


@NgModule({
  imports: [
    CommonModule,
    MyCommonModule,
    MarkdownModule,
    RouterModule.forChild(PORTFOLIO_ROUTES)
  ],
  declarations: [PortfolioHomeComponent]
})
export class PortfolioModule { }
