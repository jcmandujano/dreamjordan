import { Component } from '@angular/core';
import { CartService, Product } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import {Router} from '@angular/router';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';//paypal ios only

import { Platform } from '@ionic/angular';
 

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
  applePIDs:any;
  transaction_id: string = "Test";
  //for braintree in ios only
  braintree_token = 'sandbox_fwz2cyc9_prmgr28yvpr28pqw';
  //paymentOptions: PaymentUIOptions ;

  defaultCurrency = 'USD';
  public is_ios=false;

  constructor( private cartserv : CartService,
    private iap: InAppPurchase,
    public co: CommonService,
    private payPal: PayPal,//Paypal ios only
    public user : UserService,
    private router:Router,
    public platform: Platform
  ) {
    
  }

  ionViewDidEnter(){
    this.user.customLoginStatus().then(data => {
      if(data!= null){
        this.currentUser=data;
      }
      this.user.authenticationState.subscribe(state => {
        if (state) {
          this.sessionState=state;
        } else {
          this.sessionState=state;
        }
      });
    });
    this.cartItemCount = this.cartserv.getCartItemCount();
    this.cart = this.cartserv.getCart();
    if( this.cart.length>=1 && this.cart[0].field_moneda ){
      this.defaultCurrency = this.cart[0].field_moneda;
    }
    this.applePIDs = this.getTourAppleIds();
    for(let _p of this.cart){
      console.log(_p);
    }
  }

  getTourAppleIds(){
    return this.cart.map((i)=>{
      return i.field_id_prod_apple;
    })
  }

  getCurrentItem(item:string){
    let tempitems = this.cart;
    return tempitems.filter((i)=>{
      return i.field_id_prod_apple == item;
    })
  }

  buyitems(){
    if(this.sessionState){
      console.log("Que jay en el carro",this.cart);
      let items = this.getTourAppleIds();
      let products : any;
      let currentItem : any;
      this.co.showLoader();
      this.iap.getProducts([items.join()]).then((_product) => {
        this.co.hideLoader();
        console.log("respuesta",_product);
        products = _product
        if(products.length == 0){
          this.co.presentAlert("Error","","No se encontró este producto en Apple");
        }else{
          let rowLen = products.length;
          products.map((element,i)  =>{
            this.iap.buy(element.productId).then((data)=> {
              console.log("elemento iterado",element.productId);
              currentItem =this.getCurrentItem(element.productId); 
            // console.log("Que resulto de la compra",data);
                console.log("item actual el ulimo",currentItem);
                this.co.showLoader();
                this.cartserv.insertInAppPurchase("checkout", this.currentUser.user+"-", data, false, currentItem).subscribe(
                  (res:any) => { 
                    console.log("resp comopra",res);
                    this.co.presentToast("La compra se relizo correctamente");
                    if (rowLen === i + 1) {
                      this.emptyCurrentCart();
                      this.co.go('/tabs/my-purchases');
                    }
                  },
                  (err: HttpErrorResponse) => { 
                    this.co.hideLoader();
                    console.log(err);
                    var message = err.error.message;
                    if(err.status == 400){
                      message = 'Correo electrónico o contraseña no reconocidos.';
                    }
                    this.co.presentAlert('Error','Hubo un problema al insertar la compra.',message);
                  }
                );
            }).catch((err)=> {
                this.co.hideLoader();
                console.log(err);
                this.co.presentAlert("ERROR","",JSON.stringify(err) );
            });
          });
        }
      }).catch((err) => {
        this.co.hideLoader();
       console.log(err);
       this.co.presentAlert("ERROR","",JSON.stringify(err) );
     });
    }else{
      this.co.presentAlert("Error","","Necesitas acceder para poder comprar contenido.");
      this.router.navigate(['/tabs/login']);
    }
    
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
    this.cartserv.insertPurchase("checkout", this.currentUser.user+"-", this.transaction_id, false).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.co.presentToast("La compra se relizo correctamente");
        //this.paypalWithPaypal();
      },
      (err: HttpErrorResponse) => { 
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','Hubo un problema al insertar la compra.',message);
      }
    );
  }

  paypalPayment(){//braintree ios only
    if(this.sessionState){
      let totalAmount = this.getTotal();
      this.payPal.init({
        PayPalEnvironmentProduction: 'AVxNm7rigbHzmf02mzz1TLhDJZuJqYOXavlecCP2cMQMEL1nG4gxChDa-mr5_d8vCOLit8IruMhZGgoo',
        PayPalEnvironmentSandbox: 'AdZC_ONPv1oNHUaoxVxTK2xi_u2jv91CKGC1RU9bqluhk7q94EwdcUOQNis8mc0vcQBdbFrv98sGEyi4'
      }).then(() => {
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.payPal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
        })).then(() => {
          let payment = new PayPalPayment(totalAmount.toString(), 'USD', 'Description', 'sale');
          this.payPal.renderSinglePaymentUI(payment).then(() => {
            // Successfully paid
            this.insertCheckout();
            this.emptyCurrentCart();
            this.co.go('/tabs/my-purchases');
            this.co.presentToast("La compra se realizo correctamente");
          }, (err) => {
            console.log("Error or render dialog closed",err);
            //this.co.presentAlert("Error","","Error en configuracion");
          });
        }, (err) => {
          console.log("Error in configuration",err);
          this.co.presentAlert("Error","","Error en configuracion");
        });
      }, (err) => {
        // Error in initialization, maybe PayPal isn't supported or something else
          console.log("Error in configuration","Error in initialization, maybe PayPal isn't supported or something else");
          this.co.presentAlert("Error","","maybe PayPal isn't supported");
      });
    } else{
      this.co.presentAlert("Error","","Necesitas acceder para poder comprar contenido.");
      this.router.navigate(['/tabs/login']);
    }
  }

  ionViewWillLeave(){
    //this.braintree.reset
  }
 
  goHome(){
    this.router.navigate(['/']);
  }

}