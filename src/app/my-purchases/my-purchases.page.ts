import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.page.html',
  styleUrls: ['./my-purchases.page.scss'],
})
export class MyPurchasesPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  validateCoupon(){
    this.router.navigate(['/tabs/coupon-validator']);
  }

}
