import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  myBirthdate : Date = new Date(1993, 11, 4); // 4 de diciembre de 1993
  myEmail : string = 'joherro3@topo.upv.es';

  constructor(
  ) {
  }

  ngOnInit() {
  }

  getMyAge(){
    let msdiff = moment().diff(this.myBirthdate);
    let duration = moment.duration(msdiff);
    let years = Math.floor(duration.asYears());
    let months = Math.floor(duration.subtract(years, 'years').asMonths());
    let days = Math.floor(duration.subtract(months, 'months').asDays())
    return `${
      years
    } años ${
      months
    } meses ${
      days
    } días`;
  }

  getBirthdayString(){
    return moment(this.myBirthdate).format('DD/MM/YYYY')
  }

}
