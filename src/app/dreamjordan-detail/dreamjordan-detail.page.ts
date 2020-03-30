import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import {Router, ActivatedRoute, } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService} from '../api/user.service'; 
import {Howl, howler} from 'howler';
import { IonRange, NavController } from '@ionic/angular';

export interface Track{
  nid:string;
  mid:string;
  name:string;
  field_costo:string;
  field_media_audio_file:string;
  ammount:number;
  isPlaying:boolean;
}

@Component({
  selector: 'app-dreamjordan-detail',
  templateUrl: './dreamjordan-detail.page.html',
  styleUrls: ['./dreamjordan-detail.page.scss'],
})
export class DreamjordanDetailPage {
  id_tour:any;
  transaction_id:string = "prueba";
  current_tour:any;
  audiosList:any;
  cart=[];
  cartItemCount: BehaviorSubject<number>;

  player:Howl = null;
  isValid : boolean = false;//cupon validado
  isActivated: boolean = false;//validado y activado
  isPurchased:boolean = false; //comprado
  showRegister:boolean = false; //muestra registro
  showLogin: boolean = false; //muestra login
  showTours:boolean = false;//muestra tours
  fechaComprado:Date;
  couponCode:string;
  idcheckout:any;
  tipo_tour:string = "2";
  nodeid:any;
  idTourCoupon:any;
  @ViewChildren(IonRange) ranges : QueryList<IonRange>;

  //Formdata ocupado para login y registro
  login_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });

  register_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });
  
  constructor(public active :ActivatedRoute,
    public tourService:TourService,
    public co: CommonService,
    private router:Router,
    private navCtrl: NavController,
    public user : UserService,
    private cartserv:CartService) { 
    this.id_tour = this.active.snapshot.paramMap.get("id");
  }

  ionViewWillEnter() {
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();
    this.co.showLoader();
    this.tourService.getDreamJordanTourDetail(this.id_tour).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.current_tour = res[0];
        console.log("current",this.current_tour);
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
    //Check if some user is logged JCMV

    if(this.user.account === undefined){  
      this.user.getLoginStatus().subscribe(res => { 
        this.user.account = res;
        if(this.user.account.current_user != null){
          this.showTours=true;
          this.showLogin=false;
          this.isTourPurchased();
          this.co.hideLoader();
        }else{
          this.showLogin=true;
        }
      },
      (err: HttpErrorResponse) => { 
        this.co.hideLoader();
        console.log("error",err);
      }); 
    }else{
      if(this.user.account.current_user != null){
        console.log("no hay nadie")
        this.showTours=true;
        this.showLogin=false;
        this.isTourPurchased();
      }else{
        this.showLogin=true;
      }
     
    }
  }

  isTourPurchased(){
    this.user.getPurchaseInfo().subscribe(res =>{
      let itemsComprados:any;
      //console.log("fecha", res[0].field_fecha_comprado );
      if(res.length>0){
        this.fechaComprado = new Date(res[0].field_fecha_comprado);
        console.log("fecha", this.fechaComprado );
        this.getDaysLeft();
      }
      res.forEach(element => {
        itemsComprados=JSON.parse(element.checkout_elements);
        itemsComprados.forEach(checkout_item => {
          if(Object.values(checkout_item).indexOf(this.id_tour)>-1){
            this.nodeid = element.nid;
            this.isActivated = (element.field_status === "Activado" ? true : false);
            if(this.isActivated==true){
              this.getAudiosByTour();
            }
            this.couponCode = element.transactionid;
            this.showTours=false;
            this.isValid =true;
          }
        });
      });
    },
      (err: HttpErrorResponse) => { 
        this.co.hideLoader();
        console.log("error",err);
      }); 
  } 

  getCurrentDate(){
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  getDaysLeft(){
    if(this.fechaComprado !=undefined){
      let today =  new Date();
      let diff = (today.getTime() - this.fechaComprado.getTime()) /(1000 * 3600 * 24);
      return parseInt(diff.toString());
    }
    
  }

  //once a tour was purchased or validated retrieve all the audios by tour JCMV
  getAudiosByTour(){
    this.co.showLoader();
    this.tourService.getAudiosxTour(this.id_tour).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.audiosList = res;
        this.audiosList.forEach(originales => {
          originales.audioelement=this.start(originales);
          originales.progress=0;
        });        
        console.log("audios",this.audiosList);
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

  //Store the validate coupon JCMV
  /*validate(coupon:string){
    if(this.user.account.current_user){
      this.co.showLoader();
      this.addToCart();
      this.cartserv.insertSinglePurchase("checkout", this.current_tour.title, coupon, false).subscribe(
        (res:any) => { 
          this.nodeid = res.checkout;
          this.co.hideLoader();
          this.co.presentToast("Se realizo la compra correctamente");
          this.isValid=true;
          this.isActivated=false; 
          this.showTours=false
          this.cartserv.emptyCart();
        },
        (err: HttpErrorResponse) => { 
          //console.log(err);
          this.co.hideLoader();
          this.cartserv.emptyCart();
          var message = err.error.message;
          if(err.status == 400){
            message = 'Correo electrónico o contraseña no reconocidos.';
          }
          this.co.presentAlert('Error','Hubo un problema al iniciar sesión.',message);
        }
      );
    }
  }*/

  muestraRegistro(){
    this.showLogin = false;
    this.showRegister  = true;
  }

   //activate the current tour(only if is purchased) to start countdown duration JCMV
  activate(){
    this.co.showLoader();
    console.log("nodo",this.nodeid);
    this.cartserv.activateDreamJordanTour(this.nodeid).subscribe((res) =>{
      //console.log("actualizado",res);
      this.co.hideLoader();
      this.co.presentToast("Se ha activado correctamente el contenido.");
      this.getAudiosByTour();
      this.isActivated=true;
    },
    (err: HttpErrorResponse) => { 
      console.log(err);
      this.co.hideLoader();
      this.cartserv.emptyCart();
    }) 
  } 

  //Login user JCMV
  doLogin(data){
    this.co.showLoader();
    this.user.login(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.user.account = res;
        this.showTours = true;
        
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','Hubo un problema al iniciar sesión.',message);
      }
    );
  }

  //Register user and do login process JCMV
  register(data){
    this.co.showLoader();
    this.user.register(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.user.account = res;
        this.showTours = true;
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
        this.co.presentAlert('Error','Hubo un problema al registrar el usuario.',message);
      }
    );
  }

  validateCoupon(){
    this.co.showLoader();
    this.cartserv.validateCoupon(this.couponCode).subscribe(
      (res:any) => { 
        console.log("miciela",res);
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
          //this.getTourInfo(res[0].field_tour);
          //Una vez obtenida la informacion
          this.insert(this.couponCode, this.current_tour);
        }
        console.log("cupon",res);
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        this.co.presentAlert('Error','Hubo un problema al validar la información',"");
      });
    }

  //Store the validate coupon JCMV
  insert(coupon:string, data:any){
    this.addToCart();
    this.cartserv.insertSinglePurchase("checkout", data.title, coupon, false).subscribe(
      (res:any) => { 
        console.log("insert response ",res);
        this.nodeid = res.checkout;
        this.idcheckout = res.checkout;
        this.co.hideLoader();
        this.cartserv.emptyCart();
        this.co.presentToast("Se realizo la compra correctamente");
        this.canjeaCupon();
        //banderas para mostrar acttivador
        this.isValid=true;
        this.isActivated=false; 
        this.showTours=false
        this.showLogin = false;
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


  //Called at the moment to insert purchase with the tour info, once inserted this object will be destroyed JCMV
  //NOTE: When mid==="0" means that the full tour was purchased.
  addToCart(){
    let object:any = {
      "nid": this.current_tour.nid,
      "mid": "0",
      "name": this.current_tour.title,
      "field_costo": this.current_tour.field_costo_dream_jordan_tour,
      "field_media_audio_file": "",
      "amount": 1
    }
    this.cartserv.addProduct(object);
  }

  //Route to show cart page JCMV
  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }

  prepareItems(){
    this.audiosList.forEach(originales => {
      originales.audioelement=this.start(originales);
      originales.progress=0;
    });
    console.log(this.audiosList);
  }

  /*METODOS PARA AUDIO PLAYER*/
  start(track:Track){
    this.player = new Howl({
      src:[this.co.PRIMARY_DOMAIN+track.field_media_audio_file],
      html5:true,
      onplay:() =>{
        console.log("playing");
        track.isPlaying=true;
      },
      onend:()=>{
        console.log("onend");
        track.isPlaying=false;
        this.updateFinished(track);
      },
      onpause:()=>{
        console.log("paused");
        track.isPlaying=false;
      }
    });
    return this.player;
  }

    play(track:Howl){
    track.play();
    this.updateProgress(track);
    }

    pause(track:Howl){
    track.pause();
    }

    //guardamos un play mas, al contador de plays
    updateFinished(track){
    console.log("NID",track);

    }

    seek(audio:Howl, i:number){
    let currentRange = this.ranges.filter((element,index)=> index == i);
    let newValue =+ currentRange[0].value;
    let duration = audio.duration();
    audio.seek(duration * (newValue/100));
    }

    updateProgress(track:Howl){
    let seek =  track.seek();
    track.progress = (seek/track.duration()) * 100;
    setTimeout(()=>{
      this.updateProgress(track);
    }, 1000)
  }
  goHome(){
    this.router.navigate(['/tabs/dreamjordan-plans']);
  }

  goBack() {
    this.navCtrl.back();
    }

}