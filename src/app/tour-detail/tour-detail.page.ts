import { Component, ViewChildren, QueryList } from '@angular/core';
import {Router, ActivatedRoute, } from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import {Howl, howler} from 'howler';
import { IonRange } from '@ionic/angular';
import { UserService} from '../api/user.service';
import { DownloadService } from '../api/download.service'; 
import { NavController } from '@ionic/angular';
import { StorageService } from '../storage.service';
import { NetworkService, ConnectionStatus } from "../api/network.service";


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
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.page.html',
  styleUrls: ['./tour-detail.page.scss'],
})
export class TourDetailPage{
  /*Variables para el carrito*/
  cart=[];
  products = [];
  cartItemCount: BehaviorSubject<number>;
  /*Variables para el carrito*/

  ammount : number = 1;
  nid:any;
  idPais:any;
  comprado:boolean = false;
  currentTour:any;
  tipo_tour:string = "1";
  toursComprados:any;
  isPurchased:boolean =false;
  online:boolean=false;

  /*variables para audio player*/
  activetrack : Track = null;
  isPlaying:boolean = false;
  playlist = new Array();
  @ViewChildren(IonRange) ranges : QueryList<IonRange>;
  /*variables para audio player*/
  
  blockByGlobalPurchase:boolean=false;

  get player(){ return this.tourService.player; }
  set player( val ){ this.tourService.player = val; }
  get audiosArray(){ return this.tourService.audiosArray; }
  set audiosArray( val ){ this.tourService.audiosArray = val; }

  constructor(private router:Router,
    public tourService:TourService,
    public co: CommonService,
    private network : NetworkService,
    private navCtrl: NavController,
    public active : ActivatedRoute,
    public storage: StorageService,
    public user : UserService,
    public download : DownloadService,
    private cartserv:CartService) { 
      this.nid = this.active.snapshot.paramMap.get("nid");
      this.idPais = this.active.snapshot.paramMap.get("idpais");
  }
  

  addToCart(product){
    //console.log("item",product);
    this.cartserv.addProduct(product);
  }

  ionViewDidEnter() {
    this.tourService.clearAudios();
    if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Online){
      this.co.showLoader();
      this.online=true;
      this.getTourInfo();
      this.tourService.getAudiosxTour(this.nid).subscribe(
        (res:any) => { 
          console.log("data",res);
          this.audiosArray = res;    
          this.co.hideLoader();    
          this.getPurchasedItems();
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
    }else{
      console.log("recuperando los locales");
      this.online=false;
      this.getLocalTours();
      this.getLocalAudios();
    }
    
    this.products = this.cartserv.getProducts();
    this.cart = this.cartserv.getCart();
    //console.log("carrito",this.cart);
    this.checkIfIsPurchased();
    this.cartItemCount = this.cartserv.getCartItemCount();
  }

  checkIfIsPurchased(){
    for(let i in this.cart ){
      if(this.cart[i].nid==this.idPais){
        //console.log("bloqueado");
        this.blockByGlobalPurchase=true;
      }
    }
    //blockByGlobalPurchase
  }

  prepareItems(){
    //console.log("AUDIOS en prepare",this.audiosArray);
    console.log("comprados",this.toursComprados);
    this.audiosArray.forEach(originales => {
      originales.amount=1;
      originales.audioelement=this.start(originales);
      originales.progress=0;
       this.toursComprados.forEach(comprados => {
          originales.descargado = comprados.field_descargado;
          originales.carrito_id = comprados.nid
          originales.plays = comprados.field_plays
      }); 
    });
    console.log(this.audiosArray);
  }

  isNumber(value) {
    if(typeof(value) == "number"){
      return true;
    }else{
      return false;
    }
  }

  getTourInfo(){
    this.tourService.getSingleTour(this.idPais,this.nid).subscribe(
      (res:any) => { 
        this.currentTour = res[0];
        console.log("currnt tour",this.currentTour);
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        let message = err.error.message;
        if(err.status == 400){
          message = '.';
        }
        this.co.presentAlert('Error','Hubo un problema al recuperar la información.',message);
      }
    );
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }

  getPurchasedItems(){
    this.user.getProcessedItems(this.nid, this.tipo_tour).subscribe(res =>{
      this.toursComprados=res;
      //console.log("purchassed",res);
      if(res.length>0){
        this.isPurchased = true;
      }
      //this.co.hideLoader();
      this.prepareItems();      
    },
      (err: HttpErrorResponse) => { 
        console.log("error",err);
        //this.co.hideLoader();
      }); 
  } 

  buyAllTour(){
    let data = {
      nid:this.currentTour.nid,
      mid:this.currentTour.nid,
      name:this.currentTour.title,
      field_costo:this.currentTour.field_costo,
      field_media_audio_file:"",
      amount:1,
      image:this.currentTour.field_imagen_tour_app,
      field_id_prod_apple:this.currentTour.field_id_prod_apple
    }
    if(this.audiosArray.length==1){
      console.log("NO ES un paquete");
      data.field_media_audio_file = this.audiosArray[0].field_media_audio_file;
      data.mid = this.audiosArray[0].mid;
    }
    this.cartserv.addProduct(data);
    this.cartserv.addAudios(this.audiosArray);
  }

  /*METODOS PARA AUDIO PLAYER*/
  start(track:Track){
     //console.log('start',track);,
     let aux_track : any;
     if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Online){
        aux_track = new Howl({
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
     }else{
      let win: any = window;
      let path = win.Ionic.WebView.convertFileSrc(track.field_media_audio_file);
      aux_track = new Howl({
        src:[path],
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
     }
      
      return aux_track;
  }

  play(track:Howl){
    //track.play();
    console.log("this.tourService.player",this.tourService.player);
    if(this.tourService.player== null){
      this.tourService.player = track;
      this.tourService.player.play();
    }else{
      this.tourService.player.play();
    }
    this.updateProgress(track);
  }

  pause(track:Howl){
    this.tourService.player.pause();
    //track.pause();
  }

  //guardamos un play mas, al contador de plays
  updateFinished(track){
    this.co.showLoader();
    console.log("ONENDTRACK",track);//track.carrito_id
    let intplays : number  = +track.plays; 
    intplays = (intplays+1);
   this.tourService.updatePlays(track.carrito_id, intplays).subscribe((res)=>{
      this.co.hideLoader();
      //console.log("respuesta ", res);
      track.plays = res.field_plays;
    },(err: HttpErrorResponse)=>{
      this.co.hideLoader();
      console.log("error ", err.message);
    });
  }

  seek(audio:Howl, i:number){
    let currentRange = this.ranges.filter((element,index)=> index == i);
    let newValue =+ currentRange[0].value;
    audio.seek(newValue);
  }

  ionViewWillLeave(){
    console.log("im leaving");
    this.audiosArray.map((element)=>{
      console.log("item mapeado",element);
    })
    /*  this.storage.setObject('mediadata',{
       id:0,
       local_file:"",
       no_plays:0,
     }); */
   }

  updateProgress(track:Howl){
    let seek =  track.seek();
    track.progress = seek;
    //console.log("progress",track.progress);
    setTimeout(()=>{
      this.updateProgress(track);
    }, 1000)
  }

  downloadContent(audio, status){
    this.co.showLoader();
    console.log("descargando", status);
    if(status== 1){
      this.tourService.updateDownloadFlag(audio.carrito_id,status).subscribe((res) => {
        console.log("respuesta",res);
        this.getPurchasedItems();
        this.co.hideLoader();
        this.download.downloadAudio(audio,this.currentTour, this.idPais);
      },(err: HttpErrorResponse) => { 
        console.log(err);
        this.co.hideLoader();
      }); 
    }else{
      this.tourService.updateDownloadFlag(audio.carrito_id,status).subscribe((res) => {
        console.log("respuesta",res);
        this.eliminaLocal(audio,this.currentTour);
        this.getPurchasedItems();
        this.co.hideLoader();
      },(err: HttpErrorResponse) => { 
        console.log(err);
        this.co.hideLoader();
      }); 
    }
  }

  getKey(param){
    let name = String(param.nid);
    console.log("name",name);
    return this.storage.getObject(name).then(data => {
      console.log("Datos en local", data);
      }
     );
  }

  getAllKeys(){
    this.storage.getAllObjects();
  }

  eliminaLocal(audio,tour){
    let tourkey = String(tour.nid);
    let audiokey = String(audio.mid);
    this.storage.remove(tourkey);
    this.storage.remove(audiokey);
  }

  getLocalTours(){
    return this.storage.getlocalTours().then(data => {
      console.log("tours local",data[0]);
      this.currentTour = data[0];
     });
  }

  getLocalAudios(){
    return this.storage.getLocalAudios().then(data => {
      console.log("audios local",data);
      if(data.length>0){
        this.isPurchased=true;
      }
      this.audiosArray = data;
      this.prepareItems();
     });
  }
  
  goBack() {
    this.navCtrl.back();
    }

}