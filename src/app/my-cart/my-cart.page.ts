import { Component, OnInit } from '@angular/core';
import { CartService, Product } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.page.html',
  styleUrls: ['./my-cart.page.scss'],
})
export class MyCartPage implements OnInit {
  cart : Product[] = [];
  cartItemCount: BehaviorSubject<number>;
  constructor( private cartserv : CartService,
    public co: CommonService,
    public user : UserService) { }

  ngOnInit() {
   
  }

  ionViewDidEnter(){
    if(this.user.account === undefined){
      this.co.showLoader();
      this.user.getLoginStatus().subscribe(res => { 
        this.user.account = res;
        this.co.hideLoader();
        if(this.user.account.current_user){
          console.log("Ya tenemos a alguieen1 ",res);
        }
      },
      (err: HttpErrorResponse) => { 
        this.co.hideLoader();
        console.log("error",err);
      }); 
    }
    this.cartItemCount = this.cartserv.getCartItemCount();
    this.cart = this.cartserv.getCart();
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

  pay(){
    this.co.showLoader();
    this.cartserv.insertPurchase().subscribe(
      (res:any) => { 
        console.log("resoyesta",res);
        this.co.hideLoader();
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','¡UPS!, hubo un problema al iniciar sesión.',message);
      }
    );
    console.log("pagameee");
  }
}