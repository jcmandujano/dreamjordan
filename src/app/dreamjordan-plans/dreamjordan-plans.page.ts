import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-dreamjordan-plans',
  templateUrl: './dreamjordan-plans.page.html',
  styleUrls: ['./dreamjordan-plans.page.scss'],
})
export class DreamjordanPlansPage implements OnInit {
  DreamJordanTours:any;
  cart=[];
  cartItemCount: BehaviorSubject<number>;
  constructor(private router:Router,
    public tourService:TourService,
    public co: CommonService,
    private cartserv:CartService) { }

  ngOnInit() {
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();
    this.co.showLoader();
    this.tourService.getDreamJordanTours().subscribe(res => { 
      this.co.hideLoader();
      this.DreamJordanTours = res;
      console.log("toursDreamJordan",res);
    },
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      console.log("error",err);
    });
  }

  tourDetail(nid){
    this.router.navigate(['/tabs/dreamjordan-detail/'+nid]);
  }

  buy(){
    console.log("Comprameeee!");
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }
}
