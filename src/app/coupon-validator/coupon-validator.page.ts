import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coupon-validator',
  templateUrl: './coupon-validator.page.html',
  styleUrls: ['./coupon-validator.page.scss'],
})
export class CouponValidatorPage implements OnInit {

  isValid : boolean = false;
  constructor() { }

  ngOnInit() {
  }

  validate(){
    this.isValid = true
  }

}
