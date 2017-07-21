import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioMdViewComponent } from './portfolio-md-view.component';

describe('PortfolioMdViewComponent', () => {
  let component: PortfolioMdViewComponent;
  let fixture: ComponentFixture<PortfolioMdViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioMdViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioMdViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
