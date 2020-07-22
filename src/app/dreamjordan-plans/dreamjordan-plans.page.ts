import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ConnectionStatus } from "../../app/api/network.service";

@Component({
  selector: 'app-dreamjordan-plans',
  templateUrl: './dreamjordan-plans.page.html',
  styleUrls: ['./dreamjordan-plans.page.scss'],
})
export class DreamjordanPlansPage {
  DreamJordanTours:any;
  cart=[];
  cartItemCount: BehaviorSubject<number>;
  constructor(private router:Router,
    public tourService:TourService,
    public co: CommonService,
    private translateService: TranslateService,
    private cartserv:CartService) { }

  ionViewDidEnter() {
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();
    this.co.showLoader();
    this.tourService.getDreamJordanTours().subscribe(res => { 
      this.co.hideLoader();
      this.DreamJordanTours = res;
      //console.log("toursDreamJordan",res);
    },
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      this.co.presentAlert("Error","Ocurrio un problema al recuperar el tour",err.message);
      console.log("error",err);
    });
  }

  tourDetail(nid){
    let lang =  this.translateService.currentLang;
    let msg="";
    if(lang == "es") {
      msg = "No estas conectado a internet.";
    }else{
        msg = "You are disconnected.";
    }
    if(ConnectionStatus.Online){
      this.router.navigate(['/tabs/dreamjordan-detail/'+nid]);
    }else{
      this.co.presentToast(msg);
    }
    
  }

  buy(){
    console.log("Comprameeee!");
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }
}
