import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.page.html',
  styleUrls: ['./countries.page.scss'],
})
export class CountriesPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  countryDetail(){
    this.router.navigate(['/tabs/country-detail']);
  }
  

}
