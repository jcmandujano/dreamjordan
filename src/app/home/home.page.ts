import { Component } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../api/common.service';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import {TourService} from '../api/tour.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Platform } from '@ionic/angular';
import {StorageService, Item} from '../api/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  localItems : Item[]  = [];
  cart=[];
  paises : any;
  cartItemCount: BehaviorSubject<number>;
  DreamJordanTours:any;
  constructor(private router:Router, 
    public user : UserService, 
    public co: CommonService,
    public tourService:TourService,
    private cartserv : CartService,
    private nativeStorage: NativeStorage,
    public platform: Platform,
    private storage : StorageService) {
      this.cartItemCount = this.cartserv.getCartItemCount();
      this.cart = this.cartserv.getCart();
     }

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
    this.recuperaDreamJordan();
  }

 /* loadStorageItems(){ SEGUIMIS DESOUES∫
    this.storage.getItems().then(items =>{
     this.localItems = items;
     console.log("items",this.localItems);
    });
  }*/

  recuperaPaises(){
    //recuperamos paises
    this.user.getPaises().subscribe(res => { 
      this.paises = res;
    },
    (err: HttpErrorResponse) => { 
      console.log("error",err);
    });
  }

  recuperaDreamJordan(){
    this.tourService.getDreamJordanTours().subscribe(res => { 
      this.co.hideLoader();
      this.DreamJordanTours = res;
      //console.log("toursDreamJordan",res);
    },
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      console.log("error",err);
    });
  }

  // funcion llamada desde el boton "valida cupon"
  validateCoupon(){
    //if(this.user.account.current_user){
      this.router.navigate(['/tabs/coupon-validator']);
    /*}else{
      let navigationExtras: NavigationExtras = {
        state: {  
          origin: "validaCupon"
        }
      };
      this.router.navigate(['/logreg-select'],navigationExtras);
    }*/
  }
  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }
}
