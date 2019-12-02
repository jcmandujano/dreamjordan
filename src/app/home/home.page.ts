import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}


  slideOpts = {
    freeMode: true,
    slidesPerView: 2,
    spaceBetween: 10,
    autoHeight:true
  };
}
