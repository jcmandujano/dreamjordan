import { Component } from '@angular/core';
import { CartService, Product } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import {Router} from '@angular/router';
//import { Braintree, ApplePayOptions, PaymentUIOptions, PaymentUIResult } from '@ionic-native/braintree/ngx'; //braintree ios only
//import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';//paypal ios only

 

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
  //for braintree in ios only
  braintree_token = 'sandbox_fwz2cyc9_prmgr28yvpr28pqw';
  //paymentOptions: PaymentUIOptions ;


  constructor( private cartserv : CartService,
    public co: CommonService,
    //private payPal: PayPal,//Paypal ios only
    //private braintree: Braintree,//Braintree ios only
    public user : UserService,
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
        this.co.presentAlert('Error','Hubo un problema al insertar la compra.',message);
      }
    );
  }

 /* braintreePayment(){//braintree ios only
    if(this.sessionState){
      let totalAmount = this.getTotal();
      this.paymentOptions   = {
        amount: totalAmount.toString(),
        primaryDescription: 'Dream jordan Services',
      } ;
      console.log("paymentOptions",this.paymentOptions);
      this.braintree.initialize(this.braintree_token)
        .then(() => this.braintree.presentDropInPaymentUI(this.paymentOptions))
        .then((result: PaymentUIResult) => {
          if (result.userCancelled) {
            console.log("User cancelled payment dialog.");
            
            this.co.presentAlert("Error","","Ocurrio un error con la forma de pago");
          } else {
            console.log("User successfully completed payment!");
            console.log("Payment Result.", result);//nonce
            this.insertCheckout();
            console.log("se logro",result); 
            this.emptyCurrentCart();
            this.co.go('/tabs/my-purchases');
          }
        })
        .catch((error: string) => console.error(error));
    } else{
      this.co.presentAlert("Error","","Necesitas acceder para poder comprar contenido.");
      this.router.navigate(['/tabs/login']);
    }
    
  }*/

   /*paypalWithPaypal(){
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
          let payment = new PayPalPayment(this.getTotal().toString(), 'USD', 'Description', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then((data) => {
            // Successfully paid
            this.insertCheckout();
            console.log("se logro",data); 
            this.emptyCurrentCart();
            this.co.go('/tabs/my-purchases');
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
    
  }*/

  ionViewWillLeave(){
    //this.braintree.reset
  }
 
  goHome(){
    this.router.navigate(['/']);
  }

}