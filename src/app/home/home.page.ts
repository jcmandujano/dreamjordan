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
import { StorageService } from '../storage.service';
import { NetworkService, ConnectionStatus } from "../../app/api/network.service";

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
  currentUser:any;
  sessionState:boolean;

  slideOptsHome: SwiperConfigInterface = {
    initialSlide: 0,
    slidesPerView: 1,
  };

  slideOpts: SwiperConfigInterface = {
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
    private storage : StorageService,
    private cartserv : CartService,
    private translateService: TranslateService,
    public platform: Platform) {
      this.cartItemCount = this.cartserv.getCartItemCount();
      this.cart = this.cartserv.getCart();
     }
     
  //valida si existe un usuario logeado JCMV 20012020 
  ionViewWillEnter(){
    this.user.customLoginStatus().then(data => {
      //console.log("USUARIO DESDE TABS",data);
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
    this.recuperaPaises();
  }

  async recuperaPaises(){//offline check jcmv
    //recuperamos paises
    console.log('recuperando paises');
    await this.co.showLoader();
    this.tourService.getPaises().pipe(
      finalize(() => {
        this.countriesEnded = true;
      }),
    ).subscribe(async res => { 
        this.paises = res;
        await this.recuperaDreamJordan();
        await this.recuperaSliderTours();
        this.co.hideLoader();
    },
    (err: HttpErrorResponse) => { 
      console.log("error",err);
      this.co.hideLoader();
    });
  }

  async recuperaDreamJordan(){//offline check jcmv
    //this.co.showLoader();
    await this.tourService.getDreamJordanTours().pipe(
      finalize(() => {
        this.jdtoursEnded = true;
      }),
    ).subscribe(res => { 
      this.DreamJordanTours = res
      console.log("getDreamJordanTours",res);
    },
    (err: HttpErrorResponse) => { 
      console.log("error",err);
    
    });
  }

  async recuperaSliderTours(){//offline check jcmv
    console.log('recupera slidersTours');
    await this.tourService.getSliderTours().pipe(
      finalize(() => {
        console.log('llamando finalize sliderstours');
        this.sliderEnded = true;
      
      }),
    ).subscribe(res => { 
      console.log('res de slidertours', res);
      this.sliderTours = res;
    },
    (err: HttpErrorResponse) => { 
      console.log("error",err);
     
    });
  }

  // funcion llamada desde el boton "valida cupon"
  validateCoupon(){
    if(this.sessionState){
      this.router.navigate(['/tabs/coupon-validator']);
    }else{
      this.router.navigate(['/tabs/login']);
    }
      
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
}