import { Component } from '@angular/core';
import {Router} from '@angular/router';
import { CommonService } from '../api/common.service';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import {TourService} from '../api/tour.service';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.page.html',
  styleUrls: ['./countries.page.scss'],
})
export class CountriesPage {
  paises : any;
  skeletons:any;
  cartItemCount: BehaviorSubject<number>;
  cart=[];
  constructor(private router:Router,
    public user : UserService, 
    public co: CommonService,
    private cartserv:CartService,
    public tourServ:TourService) { }
    

  ionViewDidEnter() {
    this.cartItemCount = this.cartserv.getCartItemCount();
    this.cart = this.cartserv.getCart();
    //recuperamos paises
    this.co.showLoader();
    this.tourServ.getPaises().subscribe(res => { 
      this.co.hideLoader();
      this.paises = res;
      //console.log("paises",res);
    },
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      this.co.presentAlert("Error","Ocurrio un problema al recuperar los países",err.message);
      console.log("error",err);
    });
  }

  countryDetail(idPais){
    this.router.navigateByUrl('/tabs/country-detail/'+idPais);
  }
  
  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }

  ngOnDestroy(){
    console.log("saliendo");
  }

}