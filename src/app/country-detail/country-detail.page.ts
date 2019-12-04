import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.page.html',
  styleUrls: ['./country-detail.page.scss'],
})
export class CountryDetailPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  tourDetail(){
    this.router.navigate(['/tabs/tour-detail']);
  }


}
