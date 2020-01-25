import { Component, OnInit } from '@angular/core';
import { CartService, Product } from '../api/cart.service';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.page.html',
  styleUrls: ['./my-cart.page.scss'],
})
export class MyCartPage implements OnInit {
  cart : Product[] = [];
  constructor( private cartserv : CartService
    ) { }

  ngOnInit() {
    this.cart = this.cartserv.getCart();
  }

  decreaseCartItem(product){
    this.cartserv.decreaseProduct(product);
  }

  increaseCartItem(product){
    this.cartserv.addProduct(product);
  }

  removeCartItem(product){
    this.cartserv.removeProduct(product);
  }

  getTotal(){
    return this.cart.reduce((i,j) =>  i + j.price * j.ammount,0);
  }

}