import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, } from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConstantPool } from '@angular/compiler';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.page.html',
  styleUrls: ['./tour-detail.page.scss'],
})
export class TourDetailPage implements OnInit{
  /*Variables para el carrito*/
  cart=[];
  products = [];
  cartItemCount: BehaviorSubject<number>;

  nid:any;
  audiosArray:any;
  idPais:any;
  comprado:boolean = false;  
  currentTour:any;
  constructor(private router:Router,
    public tourService:TourService,
    public co: CommonService,
    public active : ActivatedRoute,
    private cartserv:CartService) { 
      this.nid = this.active.snapshot.paramMap.get("nid");
      this.idPais = this.active.snapshot.paramMap.get("idpais");
  }

  ngOnInit(){
    this.products = this.cartserv.getProducts();
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();
    console.log("carriyo",this.products);
  }

  addToCart(product){
    product.amount = 1;
    console.log("producto",product);
    this.cartserv.addProduct(product);
  }

  ionViewDidEnter() {
    this.co.showLoader();
    this.tourService.getAudiosxTour(this.nid).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.audiosArray = res;
        //console.log("audios",res);
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        let message = err.error.message;
        if(err.status == 400){
          message = '.';
        }
        this.co.presentAlert('Error','Hubo un problema al recuperar la información.',message);
      }
    );
    this.tourService.getSingleTour(this.idPais,this.nid).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.currentTour = res[0];
        //console.log("voala",res[0]);
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        let message = err.error.message;
        if(err.status == 400){
          message = '.';
        }
        this.co.presentAlert('Error','Hubo un problema al recuperar la información.',message);
      }
    );

  }

  buy(flag:boolean){
    console.log("Compramee!! " + flag);
    this.comprado = flag;
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }

}
