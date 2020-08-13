import { Component } from '@angular/core';
import { UserService } from '../api/user.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../api/cart.service';
import {TourService} from '../api/tour.service';
import {Router, ActivatedRoute, } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-coupon-validator',
  templateUrl: './coupon-validator.page.html',
  styleUrls: ['./coupon-validator.page.scss'],
})
export class CouponValidatorPage  {
  showValidator:boolean = true;
  couponCode:string;
  isValid : boolean = false;
  cartItemCount: BehaviorSubject<number>;
  cart=[];
  tourInfo:any;
  idcheckout:any;
  idTourCoupon:any;
  currentUser:any;

  get audiosArray(){ return this.tourService.audiosArray; }
  set audiosArray( val ){ this.tourService.audiosArray = val; }

  constructor(public user : UserService,
    public co: CommonService,
    public tourService:TourService,
    private storage : StorageService,
    private router:Router,
    private cartserv:CartService) { }

  ionViewDidEnter(){
    this.storage.getObject("userdata").then(data => {
      this.currentUser=data;
      if(data){
        this.showValidator = true;
        this.couponCode=undefined;
        this.isValid=false;
      }
    });
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();
  }

  validate(){
    this.co.showLoader();
    this.cartserv.validateCoupon(this.couponCode).subscribe(
      (res:any) => { 
        //Si no regresa nada, el cupon no esta dado de alta
        if(res.length == 0){
          this.co.hideLoader();
          this.co.presentAlert("Error", "El cupon no es valido", "");
        }else if(res[0].field_canjeado === "Activado"){//Si el cupon ya esta canjeado, envia esta alerta
          this.co.hideLoader();
          this.co.presentAlert("Error", "El cupon ya ha sido utilizado", "");
          }else if(res[0].field_tour === ""){//VAlidamos que el cupon este relacionado a un tour
            this.co.hideLoader();
            this.co.presentAlert("Error", "El cupon no esta asignado a ningun tour", "");
        }else{//Si el cupon no esta canjeado, se procede a validarlo
          this.idTourCoupon = res[0].nid
          //obtenemos primero el tour asignado al cupon
          this.getTourInfo(res[0].field_tour);
          this.getAudios(res[0].field_tour);
        }
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        this.co.presentAlert('Error','Hubo un problema al validar la información',"");
      });
  }

  //Una vez realizado el proceso se desactiva el cupon
  canjeaCupon(){
    //console.log("QUEPASA",this.idTourCoupon);
    this.cartserv.canjeaCupon(this.idTourCoupon).subscribe((res) =>{
      console.log("canjeado",res);
    },
    (err: HttpErrorResponse) => { 
      this.co.presentAlert("Error", "Ocurrio un problema al canjear el codigo", err.error.message);
      console.log(err);
      this.co.hideLoader();
      this.cartserv.emptyCart();
    }) 
  }

  //Store the validate coupon JCMV
  insert(coupon:string, data:any){
      this.cartserv.emptyCart();
      this.addToCart(data);
      this.cartserv.addAudios(this.audiosArray);
      this.cartserv.insertPurchase("checkout", data.title, coupon, false).subscribe(
        (res:any) => { 
          //console.log("insert response ",res);
          this.idcheckout = res.checkout;
          this.co.hideLoader();
          this.cartserv.emptyCart();
          this.canjeaCupon();
          //banderas para mostrar activador
          this.showValidator = false;
          this.isValid = true
          //banderas para mostrar activador
        },
        (err: HttpErrorResponse) => { 
          console.log(err);
          this.co.hideLoader();
          this.cartserv.emptyCart();
          this.co.presentAlert('Error','Hubo un problema con la validacion del cupon.',err.error.message);
        }
      );
  }

  addToCart(info:any){
    let object:any = {
      "nid": info.nid,
      "mid": "0",
      "name": info.title,
      "field_costo": info.field_costo_dream_jordan_tour,
      "field_media_audio_file": "",
      "amount": 1
    }
    console.log("Data",object);
    this.cartserv.addProduct(object);
  }

  getAudios(nid:number){
    this.tourService.getAudiosxTour(nid).subscribe(
      (res:any) => { 
        console.log("data",res);
        this.audiosArray = res;    
        this.co.hideLoader(); 
        this.insert(this.couponCode, this.tourInfo);   
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

  getTourInfo(nid){
    this.tourService.getDreamJordanTourDetail(nid).subscribe(
      (res:any) => { 
        this.tourInfo = res[0];
        //console.log("INFO TOUR",this.tourInfo);
        //Una vez obtenida la informacion
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
  }

  //activate the current tour(only if is purchased) to start countdown duration JCMV
  activate(){
    this.co.showLoader();
    this.cartserv.activateDreamJordanTour(this.idcheckout).subscribe((res) =>{
      //console.log("actualizado",res);
      this.co.hideLoader();
      this.co.presentToast("Se ha activado correctamente el contenido.");
      this.router.navigate(['/tabs/dreamjordan-detail/'+this.tourInfo.nid]);
    },
    (err: HttpErrorResponse) => { 
      this.co.presentAlert("Error", "Ocurrio un error al activar su codigo", err);
      console.log(err);
      this.co.hideLoader();
      this.cartserv.emptyCart();
    }) 
  }

  goHome(){
    this.router.navigate(['/tabs/home']);
  }

}