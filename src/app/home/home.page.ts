import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private router:Router) { }


  slideOpts = {
    freeMode: true,
    slidesPerView: 2,
    spaceBetween: 10,
    autoHeight:true
  };

  validateCoupon(){
    this.router.navigate(['/tabs/coupon-validator']);
  }
  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }
}
