import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.page.html',
  styleUrls: ['./my-purchases.page.scss'],
})
export class MyPurchasesPage implements OnInit {
  cart=[];
  cartItemCount: BehaviorSubject<number>;
  constructor(private router:Router,
    private cartserv:CartService) { }

  ngOnInit() {
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();
  }

  validateCoupon(){
    this.router.navigate(['/tabs/coupon-validator']);
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }

}
