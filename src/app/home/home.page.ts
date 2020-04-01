import { Component, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../api/common.service';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import {TourService} from '../api/tour.service';
import { Platform, } from '@ionic/angular';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { TranslateService } from '@ngx-translate/core';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage  {
  @ViewChild('slides',{static: true}) slides;
  cart=[];
  paises : any;
  cartItemCount: BehaviorSubject<number>;
  DreamJordanTours:object;
  sliderTours:object;
  visibles : boolean = false;
  sliderEnded=false;
  jdtoursEnded=false;
  countriesEnded=false;


  slideOptsHome: SwiperConfigInterface = {
    initialSlide: 0,
    slidesPerView: 1,
  };

  slideOpts: SwiperConfigInterface = {
    slidesPerView: 2,
    spaceBetween: 10,
    autoHeight: true,
    slidesOffsetBefore : 10,
    direction: 'horizontal',
    slidesOffsetAfter: 10
  }
  slideOptsDJ : SwiperConfigInterface = {
    slidesPerView: 2,
    spaceBetween: 10,
    autoHeight: true,
    slidesOffsetBefore : 10,
    slidesOffsetAfter: 10
  }

  constructor(private router:Router, 
    public user : UserService, 
    public co: CommonService,
    public tourService:TourService,
    private cartserv : CartService,
    private translateService: TranslateService,
    public platform: Platform) {
      this.cartItemCount = this.cartserv.getCartItemCount();
      this.cart = this.cartserv.getCart();
      console.log("Constructor");
     }
     
  //valida si existe un usuario logeado JCMV 20012020
  ionViewWillEnter(){
    console.log("ionViewWillEnter");
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
  

 /* loadStorageItems(){ SEGUIMIS DESPUES
    this.storage.getItems().then(items =>{
     this.localItems = items;
     console.log("items",this.localItems);
    });
  }*/

  recuperaPaises(){
    //recuperamos paises
    this.tourService.getPaises().pipe(
      finalize(() => 
      this.countriesEnded = true),
    ).subscribe(res => { 
        this.paises = res;
        console.log("paises",res);
        this.recuperaDreamJordan();
        this.recuperaSliderTours();
        
        
    },
    (err: HttpErrorResponse) => { 
      console.log("error",err);
    });
  }

  recuperaDreamJordan(){
    this.tourService.getDreamJordanTours().pipe(
      finalize(() => 
      this.jdtoursEnded = true),
    ).subscribe(res => { 
      this.DreamJordanTours = res
    },
    (err: HttpErrorResponse) => { 
      console.log("error",err);
    });
  }

  recuperaSliderTours(){
    this.tourService.getSliderTours().pipe(
      finalize(() => 
      this.sliderEnded = true),
    ).subscribe(res => { 
      this.sliderTours = res;
      //console.log("sliderhome",this.sliderTours);
    },
    (err: HttpErrorResponse) => { 
      console.log("error",err);
    });
  }

  // funcion llamada desde el boton "valida cupon"
  validateCoupon(){
      this.router.navigate(['/tabs/coupon-validator']);
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }

  countryDetail(idPais){
    this.router.navigateByUrl('/tabs/country-detail/'+idPais);
  }

  tourDetail(nid, tid, djtour){
    if(djtour == 1){
      this.router.navigate(['/tabs/dreamjordan-detail/'+nid]);
    }else{
      this.router.navigate(['/tabs/tour-detail/'+tid+'/'+nid]);
    }
    
  }

  saveme(){
    console.log("AUCSILIO");
    setTimeout(() => this.slides.update(), 100);
  }
}
