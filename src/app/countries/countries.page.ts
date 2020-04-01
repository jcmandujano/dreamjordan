import { Component, OnInit } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import { CommonService } from '../api/common.service';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { TranslateService } from '@ngx-translate/core';
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
    public tourServ:TourService,
    private translateService: TranslateService,
    private nativeStorage: NativeStorage) { }
    

  ionViewDidEnter() {
    this.nativeStorage.getItem('carrito')
    .then(
      data => console.log(data),
      error => console.error(error)
    );
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
