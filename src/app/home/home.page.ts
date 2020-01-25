import { Component } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../api/common.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  paises : any;

  constructor(private router:Router, 
    public user : UserService, 
    public co: CommonService) { }

  visibles : boolean = false;
  slideOpts = {
    freeMode: true,
    slidesPerView: 2,
    spaceBetween: 10,
    autoHeight:true
  };

  //valida si existe un usuario logeado JCMV 20012020
  ionViewWillEnter(){
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
    this.recuperaPaises();
  }

  recuperaPaises(){
    //recuperamos paises
    this.user.getPaises().subscribe(res => { 
      this.paises = res;
    },
    (err: HttpErrorResponse) => { 
      console.log("error",err);
    });
  }

  // funcion llamada desde el boton "valida cupon"
  validateCoupon(){
    if(this.user.account.current_user){
      this.router.navigate(['/tabs/coupon-validator']);
    }else{
      let navigationExtras: NavigationExtras = {
        state: {  
          origin: "validaCupon"
        }
      };
      this.router.navigate(['/logreg-select'],navigationExtras);
    }
    
  }
  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }
}
