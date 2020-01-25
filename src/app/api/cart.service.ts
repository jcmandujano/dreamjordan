import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Product{
  nid:number;
  name:string;
  price:number;
  audio:string;
  ammount:number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  data : Product[] = [
    {nid:0, name:"producto 1", price:10, audio:"naa", ammount:1}
  ]
  private cart = [];
  private cartItemCount = new BehaviorSubject(0);
   

  constructor() { }

  getProducts(){
    return this.data;
  }

  getCart(){
    return this.cart;
  }

  getCartItemCount(){
    return this.cartItemCount;
  }

  addProduct(product){
    let added = false;
    for(let p of this.cart){
      if(p.nid === product.nid){
        p.amount += 1;
        added = true;
        break;
      }
    }
    if(!added){
      this.cart.push(product);
    }
    this.cartItemCount.next(this.cartItemCount.value + 1 );
    console.log("test",this.cart);
  }

  decreaseProduct(product){
    for(let [index,p] of this.cart.entries()){
      if(p.nid === product.nid){
        p.ammount -= 1;
        if(p.ammount == 0){
          this.cart.splice(index,1);
        }
      }
    }
    this.cartItemCount.next(this.cartItemCount.value - 1);
  }

  removeProduct(product){
    for(let [index, p] of this.cart.entries()){
      if(p.nid === product.nid){
        this.cartItemCount.next(this.cartItemCount.value - p.ammount);
        this.cart.splice(index,1);
      }
    }
  }


}
