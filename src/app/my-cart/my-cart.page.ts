import { Component } from '@angular/core';
import { CartService, Product } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import { Braintree, PaymentUIOptions, PaymentUIResult } from '@ionic-native/braintree/ngx';
import {Router} from '@angular/router';


@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.page.html',
  styleUrls: ['./my-cart.page.scss'],
})
export class MyCartPage {
  cart : Product[] = [];
  cartItemCount: BehaviorSubject<number>;
  currentUser:any;
  sessionState:boolean;
  transaction_id: string = "Test";
  
  constructor( private cartserv : CartService,
    public co: CommonService,
    public user : UserService,
    private braintree: Braintree,
    private router:Router) { }

  ionViewDidEnter(){
    this.user.customLoginStatus().then(data => {
      if(data!= null){
        this.currentUser=data;
      }
      this.user.authenticationState.subscribe(state => {
        if (state) {
          this.sessionState=state;
          //console.log("user is logged in ", state);
        } else {
          this.sessionState=state;
          //console.log("user is NOT logged in ",state);
        }
      });
    });
    this.cartItemCount = this.cartserv.getCartItemCount();
    this.cart = this.cartserv.getCart();
    //console.log("cart",this.cart);
  }

  //Delete selected item from the cart list JCMV
  removeCartItem(product){
    this.cartserv.removeProduct(product);
  }

  //Get the total price JCMV
  getTotal(){
    return this.cart.reduce((i,j) =>  i + j.field_costo * j.amount,0);
  }

  emptyCurrentCart(){
    this.cart = [];
    this.cartserv.emptyCart();
  }

  insertCheckout(){
    this.co.showLoader();
    this.cartserv.insertSinglePurchase("checkout", this.currentUser.user+"-", this.transaction_id, false).subscribe(
      (res:any) => { 
        //console.log("resp comopra",res);
        this.co.hideLoader();
        this.co.presentToast("La compra se relizo correctamente");
        //this.paypalWithPaypal();
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','Hubo un problema al iniciar sesión.',message);
      }
    );
  }

  braintreePayment(){
    const BRAINTREE_TOKEN = 'sandbox_fwz2cyc9_prmgr28yvpr28pqw';
    const paymentOptions: PaymentUIOptions = {
      amount: '14.99',
      primaryDescription: 'Your product or service (per /item, /month, /week, etc)',
    }

    this.braintree.initialize(BRAINTREE_TOKEN)
    .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
    .then((result: PaymentUIResult) => {
      console.log("return ",result)
      if (result.userCancelled) {
        console.log("User cancelled payment dialog.");
      } else {
        console.log("User successfully completed payment!");
        console.log("Payment Nonce: " + result.nonce);
        console.log("Payment Result.", result);
      }
    })
    .catch((error: string) => console.error(error));
    }

  
  goHome(){
    this.router.navigate(['/']);
  }

}