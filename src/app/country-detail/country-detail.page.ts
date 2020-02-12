import { Component } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';

export interface Track{
  nid:string;
  mid:string;
  name:string;
  field_costo:string;
  field_media_audio_file:string;
  amount:number;
  isPlaying:boolean;
}

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.page.html',
  styleUrls: ['./country-detail.page.scss'],
})

export class CountryDetailPage {
  idPais: any;
  toursComprados= new Array;
  paisSelecc : any;
  tipo_tour:string = "1";
  tours:any;
  cart=[];
  cartItemCount: BehaviorSubject<number>;
  constructor(public router:Router,
    public tourService:TourService,
    public user : UserService,
    public co: CommonService,
    public active : ActivatedRoute,
    private cartserv:CartService) { 
      this.idPais = this.active.snapshot.paramMap.get("id");
  }


  ionViewDidEnter() {
    this.co.showLoader();
    this.tourService.getToursByCountry(this.idPais).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.tours = res;
        this.getPurchasedItems();
      },
      (err: HttpErrorResponse) => { 
        console.log(err);
        this.co.hideLoader();
        let message = err.error.message;
        if(err.status == 400){
          message = '.';
        }
        this.co.presentAlert('Error','Hubo un problema al recuperar la información.',message);
      }
    );

    this.user.getPaisById(this.idPais).subscribe(res => { 
      this.co.hideLoader();
      this.paisSelecc = res[0];
    },
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      console.log("error",err);
    });
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();
  }

  getPurchasedItems(){
    this.user.getPurchaseInfo().subscribe(res =>{
      res.forEach(element => {
        this.toursComprados.push(JSON.parse(element.checkout_elements));
      });
      this.co.hideLoader();     
    },
      (err: HttpErrorResponse) => { 
        console.log("error",err);
      }); 
  } 


  tourDetail(nid){
    this.router.navigate(['/tabs/tour-detail/'+this.idPais+'/'+nid]);
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }

  addToCart(){
    let cartElement : Track;
    this.tours.forEach(element => {
      this.tourService.getAudiosxTour(element.nid).subscribe(
        (res:any) => { 
          for(let j in res){
            for(let i in this.toursComprados){
             if( (this.toursComprados[i][0].audio != res[j].mid)){
              cartElement = res[j]
              cartElement.amount = 1;
              //console.log("cartelement",cartElement);
              this.cartserv.addProduct(cartElement);
             }
            }
          }
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
    }); 
  }
}
