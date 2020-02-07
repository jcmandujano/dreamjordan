import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {Router, ActivatedRoute, } from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import {Howl, howler} from 'howler';
import { IonRange } from '@ionic/angular';
import { UserService} from '../api/user.service'; 

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
export class TourDetailPage implements OnInit{
  /*Variables para el carrito*/
  cart=[];
  products = [];
  cartItemCount: BehaviorSubject<number>;
  /*Variables para el carrito*/

  ammount : number = 1;
  nid:any;
  audiosArray:any;
  idPais:any;
  comprado:boolean = false;  
  currentTour:any;
  tipo_tour:string = "1";
  toursComprados:any;
  isPurchased:boolean =false;
  /*variables para audio player*/
  activetrack : Track = null;
  player:Howl = null;
  isPlaying:boolean = false;
  playlist = new Array();
  @ViewChildren(IonRange) ranges : QueryList<IonRange>;
  /*variables para audio player*/

  constructor(private router:Router,
    public tourService:TourService,
    public co: CommonService,
    public active : ActivatedRoute,
    public user : UserService,
    private cartserv:CartService) { 
      this.nid = this.active.snapshot.paramMap.get("nid");
      this.idPais = this.active.snapshot.paramMap.get("idpais");
  }

  ngOnInit(){
    this.products = this.cartserv.getProducts();
    this.cart = this.cartserv.getCart();
    this.cartItemCount = this.cartserv.getCartItemCount();
  }

  addToCart(product){
    this.cartserv.addProduct(product);
  }

  ionViewDidEnter() {
    this.co.showLoader();
    this.getTourInfo()
    this.getPurchasedItems();
    this.tourService.getAudiosxTour(this.nid).subscribe(
      (res:any) => { 
        this.audiosArray = res;
       /*  for(let obj of this.audiosArray){
          obj.amount=1;
        } */
        this.co.hideLoader();
        this.prepareItems();
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

  prepareItems(){
    this.audiosArray.forEach(originales => {
      originales.amount=1;
      originales.audioelement=this.start(originales);
      originales.progress=0;
      this.toursComprados.forEach(comprados => {
        if(comprados.audio == originales.mid){
          originales.comprado=true;
        }
      });
    });
    //console.log(this.audiosArray);
  }

  getTourInfo(){
    this.tourService.getSingleTour(this.idPais,this.nid).subscribe(
      (res:any) => { 
        this.currentTour = res[0];
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

  /* buy(flag:boolean){ SE COMENTA POR QUE YA SE INTEGRO en "prepareItems"
    this.comprado = flag;
    this.audiosArray.forEach(element => {
      element.audioelement=this.start(element);
      element.progress=0;
    });
  } */

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }

  getPurchasedItems(){
    this.user.getProcessedItems(this.nid, this.tipo_tour).subscribe(res =>{
      this.toursComprados=res;
      if(res.length>0){
        this.isPurchased = true;
      }
    },
      (err: HttpErrorResponse) => { 
        console.log("error",err);
      }); 
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

}