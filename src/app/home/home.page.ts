import { Component } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  

  constructor(private router:Router, public user : UserService) { }

  visibles : boolean = false;
  slideOpts = {
    freeMode: true,
    slidesPerView: 2,
    spaceBetween: 10,
    autoHeight:true
  };

  ionViewWillEnter(){
    if(this.user.account === undefined){
      this.user.getLoginStatus().subscribe(res => { 
        this.user.account = res;
        console.log("Ya tenemos a alguieen")
      },
      (err: HttpErrorResponse) => { 
        console.log("povema2",err);
      });
      
    }else{
      console.log("Ya tenemos a alguieen")
    }
  }

  validateCoupon(){
    if(this.user.account === undefined){
      let navigationExtras: NavigationExtras = {
        state: {
          origin: "validaCupon"
        }
      };
      this.router.navigate(['/logreg-select'],navigationExtras);
    }else{
      this.router.navigate(['/tabs/coupon-validator']);
    }
    
  }
  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }
}
