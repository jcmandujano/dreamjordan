import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import {UserService} from '../api/user.service';
import {CommonService} from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-my-purchases',
  templateUrl: './my-purchases.page.html',
  styleUrls: ['./my-purchases.page.scss'],
})
export class MyPurchasesPage  {
  myPurchases:any;
  cart=[];
  cartItemCount: BehaviorSubject<number>;
  constructor(private router:Router,
    private cartserv:CartService,
    private user : UserService,
    public co : CommonService) { }

  ionViewWillEnter() {
    this.co.showLoader();
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();
    this.user.getPurchases().subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.myPurchases = res;
        console.log("respuesta",res);
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        this.co.presentAlert('Error','Hubo un problema al recuperar tus compras realizadas.',message);
      }
    );
  }

  validateCoupon(){
    this.router.navigate(['/tabs/coupon-validator']);
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }


  goToDetail(item:any){
    console.log("elemento seleccionado",item);
    if(item.field_dream_jordan == 1){
      //se manda a dream-jordan-detail
      this.router.navigate(['/tabs/dreamjordan-detail/'+item.tour]);
    }else{
      //se envia a country-detail
      this.router.navigate(['/tabs/tour-detail/'+item.tid+'/'+item.tour]);
      
    }
  }

  goHome(){
    this.router.navigate(['/']);
  }

}
