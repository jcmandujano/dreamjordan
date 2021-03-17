import { Component } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { NavController, Platform } from '@ionic/angular';
import { InAppPurchase } from '@ionic-native/in-app-purchase/ngx';

export interface Track{
  nid:string;
  mid:string;
  name:string;
  field_costo:string;
  field_moneda:string;
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

  isOnCart:boolean=false;

  constructor(public router:Router,
    public tourService:TourService,
    public user : UserService,
    public co: CommonService,
    private navCtrl: NavController,
    public active : ActivatedRoute,
    private cartserv:CartService,
    public platform: Platform,
    private iap: InAppPurchase,
  ) { 
      this.idPais = this.active.snapshot.paramMap.get("id");
  }

  ionViewDidEnter() {
    this.co.showLoader();
    this.tourService.getToursByCountry(this.idPais).subscribe(
      (res:any) => { 
        if(this.platform.is('ios') && this.platform.is('cordova')){
          console.log('IOS CORDOVA, comparando lista de tours con lista IAP...');
          this.tours = [];
          let apIDs = this.getToursAppleIds(res);
          this.iap.getProducts(apIDs).then((_products:any[]) => {
            for(let _tour of res){
              let _p = _products.find( x => x.productId === _tour.field_id_prod_apple );
              if(_p){
                _tour.title = _p.title;
                //_tour.body = _p.description;
                _tour.field_costo = _p.priceAsDecimal;
                _tour.field_moneda = _p.currency;

                this.tours.push(_tour);
              }
            }
            this.co.hideLoader();
            console.log("TOURS", this.tours);
            this.getPurchasedItems();
          });
        } else {
          console.log('mostrando tours sin comparar con IAP...');
          this.co.hideLoader();
          this.tours = res;
          console.log("TOURS", this.tours);
          this.getPurchasedItems();
        }
        
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
      console.log('PAIS SELEC:');
      console.log(this.paisSelecc);
    }, 
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      this.co.presentAlert("Error","Ocurrio un problema al recuperar la información del pais",err.message);
      console.log("error",err);
    });
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();

    // si se vacia el carrito poder agregarlo otravez
    if(this.cart.length == 0)
      this.isOnCart = false;
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
    console.log('NAV TO','/tabs/tour-detail/'+this.idPais+'/'+nid);
    this.router.navigate(['/tabs/tour-detail/'+this.idPais+'/'+nid]);
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }

  addToCart(){
    this.isOnCart = true;
    let data = {}
    console.log("normale",this.tours);
    if(this.toursComprados.length > 0){
      this.tours.forEach(element => {
        //console.log("elementos",element);
        for(let i in this.toursComprados){
          if( (this.toursComprados[i][0].tour != element.nid)){
            data = {
              nid:element.nid,
              mid:"0",
              name:element.title,
              field_costo:element.field_costo,
              field_moneda:element.field_moneda? element.field_moneda:'USD',
              field_media_audio_file:"",
              amount:1,
              image:element.field_imagen_tour_app, 
              field_id_prod_apple:element.field_id_prod_apple
            }
           this.cartserv.addProduct(data);
          }
        }
      }); 
    }else{
      this.tours.forEach(element => {
        //console.log("elementos",element);
        data = {
          nid:element.nid,
          mid:"0",
          name:element.title,
          field_costo:element.field_costo,
          field_moneda:element.field_moneda? element.field_moneda:'USD',
          field_media_audio_file:"",
          amount:1,
          image:element.field_imagen_tour_app,
          field_id_prod_apple:element.field_id_prod_apple
        }
       this.cartserv.addProduct(data);
      }); 
    }
  }

  getToursAppleIds(tours){
    return tours.map((i)=>{
      return i.field_id_prod_apple;
    })
  }

  goBack() {
    this.navCtrl.back();
  }
}
