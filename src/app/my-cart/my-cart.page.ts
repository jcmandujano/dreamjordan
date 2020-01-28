import { Component, OnInit } from '@angular/core';
import { CartService, Product } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.page.html',
  styleUrls: ['./my-cart.page.scss'],
})
export class MyCartPage implements OnInit {
  cart : Product[] = [];
  cartItemCount: BehaviorSubject<number>;
  constructor( private cartserv : CartService
    ) { }

  ngOnInit() {
   
  }

  ionViewDidEnter(){
    this.cartItemCount = this.cartserv.getCartItemCount();
    this.cart = this.cartserv.getCart();
    console.log("hola", this.cart);
  }

  decreaseCartItem(product){
    this.cartserv.decreaseProduct(product);
  }

  increaseCartItem(product){
    this.cartserv.addProduct(product);
  }

  removeCartItem(product){
    //console.log("eliminamesta",product);
    this.cartserv.removeProduct(product);
  }

  getTotal(){
    return this.cart.reduce((i,j) =>  i + j.field_costo * j.amount,0);
  }

  emptyCurrentCart(){
    this.cart = [];
    this.cartserv.emptyCart();
  }
}