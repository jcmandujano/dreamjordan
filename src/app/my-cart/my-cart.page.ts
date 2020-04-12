import { Component, OnInit } from '@angular/core';
import { CartService, Product } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import { PayPal, PayPalPayment, PayPalConfiguration, PayPalPaymentDetails } from '@ionic-native/paypal/ngx';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
    private router:Router,
    private payPal: PayPal) { }

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
    console.log("cart",this.cart);
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
    //this.paypalWithPaypal();
    this.co.showLoader();
    this.cartserv.insertSinglePurchase("checkout", "hola mundo", this.transaction_id, false).subscribe(
      (res:any) => { 
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

  paypalWithPaypal(){
    if(this.sessionState){
      this.payPal.init({
        PayPalEnvironmentProduction: 'ATNskmqDdI_ouR_lIK8vgq2VZWOj3pHdAUz8RNy3CtEVYOiZbrVWohvnZeBqqaFXtsRDc1E36J1E26fx',
        PayPalEnvironmentSandbox: 'ATNskmqDdI_ouR_lIK8vgq2VZWOj3pHdAUz8RNy3CtEVYOiZbrVWohvnZeBqqaFXtsRDc1E36J1E26fx'
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {
          //let paymentDetails = new PayPalPaymentDetails(this.cart);
          let payment = new PayPalPayment(this.getTotal().toString(), 'MXN', 'Description', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((data) => {
            this.insertCheckout();
            console.log("se logro",data); 
            this.emptyCurrentCart();
            this.router.navigate(['/tabs/my-purchases']);
            // Successfully paid
          }, () => {
            console.log("cancelado");
            // Error or render dialog closed without being successful
          });
        }, () => {
          console.log("error en configuracion");
          this.co.presentToast("Error en configuracion");
          // Error in configuration
        });
      }, () => {
        console.log("Error in initialization, maybe PayPal isn't supported or something else");
        this.co.presentAlert("Error","","Error in initialization, maybe PayPal isn't supported or something else");
        // Error in initialization, maybe PayPal isn't supported or something else
      });
    }else{
      this.co.presentAlert("Error","","Necesitas acceder para poder comprar contenido.");
      this.router.navigate(['/tabs/login']);
    }
    
  }

  goHome(){
    this.router.navigate(['/']);
  }

}