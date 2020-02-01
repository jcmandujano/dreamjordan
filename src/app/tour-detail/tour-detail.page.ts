import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import {Router, ActivatedRoute, } from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConstantPool } from '@angular/compiler';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import {Howl, howler} from 'howler'
import { IonRange } from '@ionic/angular';

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
   // product.amount = 1;
    this.cartserv.addProduct(product);
  }

  ionViewDidEnter() {
    this.co.showLoader();
    this.tourService.getAudiosxTour(this.nid).subscribe(
      (res:any) => { 
        this.audiosArray = res;
        for(let obj of this.audiosArray){
        obj.amount=1;
         //console.log("audios",obj);
        }
        this.co.hideLoader();
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
    this.comprado = flag;
    this.audiosArray.forEach(element => {
      element.audioelement=this.start(element);
      element.progress=0;
    });
  }

  openCart(){
    this.router.navigate(['/tabs/my-cart']);
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

  togglePlayer(pause){
    this.isPlaying = !pause;
    if(pause){
      this.player.pause();
    }else{
      this.player.play();
    }
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