import { Component, OnInit } from '@angular/core';
import { CartService, Product } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-my-cart',
  templateUrl: './my-cart.page.html',
  styleUrls: ['./my-cart.page.scss'],
})
export class MyCartPage {
  showRegister:boolean = false;
  showLogin: boolean = false;
  showCart:boolean = true;
  cart : Product[] = [];
  cartItemCount: BehaviorSubject<number>;

  login_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });

  register_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });
  
  constructor( private cartserv : CartService,
    public co: CommonService,
    public user : UserService,
    private payPal: PayPal) { }

  muestraRegistro(){
    this.showLogin = false;
    this.showRegister  = true;
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

  pay(){
    if(this.user.account.current_user){
      this.co.showLoader();
      this.cartserv.insertSinglePurchase().subscribe(
        (res:any) => { 
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
    }else{
      this.co.presentAlert('Error','Para poder comprar es necesario hacer registrarse o acceder.',"");
      this.showLogin=true;
      this.showCart = false;
    }
    
    console.log("pagameee");
  }

  paypal(){
    this.payPal.init({
      PayPalEnvironmentProduction: 'ATNskmqDdI_ouR_lIK8vgq2VZWOj3pHdAUz8RNy3CtEVYOiZbrVWohvnZeBqqaFXtsRDc1E36J1E26fx',
      PayPalEnvironmentSandbox: 'ATNskmqDdI_ouR_lIK8vgq2VZWOj3pHdAUz8RNy3CtEVYOiZbrVWohvnZeBqqaFXtsRDc1E36J1E26fx'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment('3.33', 'MXN', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((data) => {
          console.log("se logro",data);
          // Successfully paid
        }, () => {
          console.log("cancelado");
          // Error or render dialog closed without being successful
        });
      }, () => {
        console.log("error en configuracion");
        // Error in configuration
      });
    }, () => {
      console.log("Error in initialization, maybe PayPal isn't supported or something else");
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }

  doLogin(data){
    this.co.showLoader();
    this.user.login(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.user.account = res;
        this.showCart = true;
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
    //console.log("datos",data);
  }

  register(data){
    this.co.showLoader();
    this.user.register(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.user.account = res;
        this.showCart = true;
        this.showRegister = false;
        this.doLogin(data);
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','¡UPS!, hubo un problema al registrar el usuario.',message);
      }
    );
    console.log("datos",data);
  }

}
