import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { CartService } from '../api/cart.service';
import {TourService} from '../api/tour.service';
import {Router, ActivatedRoute, } from '@angular/router';

@Component({
  selector: 'app-coupon-validator',
  templateUrl: './coupon-validator.page.html',
  styleUrls: ['./coupon-validator.page.scss'],
})
export class CouponValidatorPage  {
  showRegister:boolean = false;
  showValidator:boolean = false;
  muestraLogin: boolean = true;
  couponCode:string;
  isValid : boolean = false;
  cartItemCount: BehaviorSubject<number>;
  cart=[];
  tourInfo:any;
  idcheckout:any;
  idTourCoupon:any;

  login_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });

  register_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });
  constructor(public user : UserService,
    public co: CommonService,
    public tourService:TourService,
    private router:Router,
    private cartserv:CartService) { }

  ionViewDidEnter(){
    console.log("hola",this.user.account);
    if(this.user.account === undefined){
      this.co.showLoader();
      this.user.getLoginStatus().subscribe(res => { 
        this.user.account = res;
        this.co.hideLoader();
        if(this.user.account.current_user){
          console.log("data",this.user.account.current_user);
          this.showValidator = true;
        }
      },
      (err: HttpErrorResponse) => { 
        this.co.hideLoader();
        console.log("error",err);
      }); 
    }else{ 
      if(this.user.account.current_user){
        this.showValidator = true;
      }
    }
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
          //this.co.hideLoader();//borrar
          console.log(res);
          this.idTourCoupon = res[0].nid
          //obtenemos primero el tour asignado al cupon
          this.getTourInfo(res[0].field_tour);
        }
        console.log("cupon",res);
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        this.co.presentAlert('Error','Hubo un problema al validar la información',"");
      });
  }

  //Una vez realizado el proceso se desactiva el cupon
  canjeaCupon(){
    this.cartserv.canjeaCupon(this.idTourCoupon).subscribe((res) =>{
      console.log("canjeado",res);
    },
    (err: HttpErrorResponse) => { 
      console.log(err);
      this.co.hideLoader();
      this.cartserv.emptyCart();
    }) 
  }

  //Store the validate coupon JCMV
  insert(coupon:string, data:any){
      this.addToCart(data);
      this.cartserv.insertSinglePurchase("checkout", data.title, coupon, false).subscribe(
        (res:any) => { 
          console.log("insert response ",res);
          this.idcheckout = res.checkout;
          this.co.hideLoader();
          this.cartserv.emptyCart();
          this.canjeaCupon();
          //banderas para mostrar activador
          this.showValidator = false;
          this.isValid = true
          this.muestraLogin = false;
          this.showRegister = false;
          //banderas para mostrar acttivador
        },
        (err: HttpErrorResponse) => { 
          console.log(err);
          this.co.hideLoader();
          this.cartserv.emptyCart();
          var message = err.error.message;
          if(err.status == 400){
            message = 'Correo electrónico o contraseña no reconocidos.';
          }
          this.co.presentAlert('Error','Hubo un problema con la validacion del cupon.',message);
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

  getTourInfo(nid){
    this.tourService.getDreamJordanTourDetail(nid).subscribe(
      (res:any) => { 
        this.tourInfo = res[0];
        console.log("INFO TOUR",this.tourInfo);
        
        //Una vez obtenida la informacion
        this.insert(this.couponCode, this.tourInfo);
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
      console.log(err);
      this.co.hideLoader();
      this.cartserv.emptyCart();
    }) 
  }

  muestraRegistro(){
    this.muestraLogin = false;
    this.showRegister  = true;
  }

  doLogin(data){
    this.co.showLoader();
    this.user.login(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        console.log("HIJO",res);
        this.user.account.current_user = res;
        this.showValidator = true;
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','¡UPS!, hubo un problema al iniciar sesión.',message);
      }
    );
    //console.log("datos",data);
  }

  register(data){
    this.co.showLoader();
    this.user.register(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.user.account = res;
        this.showValidator = true;
        this.showRegister = false;
        this.doLogin(data);
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','¡UPS!, hubo un problema al registrar el usuario.',message);
      }
    );
    console.log("datos",data);
  }

  goHome(){
    this.router.navigate(['/tabs/home']);
  }

}