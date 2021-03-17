import { Injectable, ɵConsole } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import { map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { CommonService } from '../api/common.service';
import {StorageService, Item} from '../api/storage.service';
import { TourService } from './tour.service';
export interface Product{
  nid:number;
  mid:number;
  name:string;
  field_costo:number;
  field_moneda:string;
  field_media_audio_file:string;
  amount:number;
  image:string;
  field_id_prod_apple:string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  data : Product[]; 
  appleData =  []; 
  itemsCarrito :any;
  private audioNodes = [];
  private cart = [];
  private cartItemCount = new BehaviorSubject(0);
  
  constructor(private nativeStorage: NativeStorage,
    public US : UserService,
    public http: HttpClient,
    public co: CommonService,
    private storage : StorageService,
    public platform: Platform
  ) { }

  getProducts(){
    return this.data;
  }

  getAppleProducts(){
    return this.appleData;
  }

  getCart(){
    return this.cart;
  }
  
  getCartItemCount(){
    return this.cartItemCount;
  }

  setCartItemCount(value){
    this.cartItemCount.next(value);
  }

  addAudios(audios){
    let isFounded = this.audioNodes.some( ai => audios.includes(ai) );
    if (!isFounded){
      for(let i of audios){
        this.audioNodes.push(i);
      }
    }
    console.log("audios al momento",this.audioNodes);
  }

  addProduct(product){
    let added = false;
    for(let p of this.cart){
      if(p.nid === product.nid && p.mid === product.mid){
        //p.amount += 1;
        added = true;
        break;
      }
    }
    if(!added){
      this.cart.push(product);
      let item = {id: product.nid, element: this.cart}
      this.cartItemCount.next(this.cartItemCount.value + 1 );
    }
  }

  addAppleProduct(product){
    this.appleData.push(product);
  }

  removeProduct(product){
    for(let [index, p] of this.cart.entries()){
      if(p.nid === product.nid){
        this.cartItemCount.next(this.cartItemCount.value - p.amount);
        this.cart.splice(index,1);
      }
    }
  }

  emptyCart(){
    this.cart = [];
    this.cartItemCount.next(0);
    this.audioNodes = [];
  }

  insertPurchase(type:string, title:string, trans_id:string, status:boolean){
    let today = this.getCurrentDate();
    this.itemsCarrito = this.buildBodyJson();
    console.log("que se va", this.itemsCarrito);
    let datos =  {
      "type":type,
      "title":title,
      "field_transactionid":[{"value":trans_id}],
      "field_status":[{"value":status}],
      "field_fecha_comprado":[{"value":today}],
      "field_elementos":this.itemsCarrito
    };
    console.log("checkout",datos);
    return this.http.post(
      this.co.API+'user/checkout?_format=json',
      JSON.stringify(datos)).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
            console.log(err);
          }
        )
      );
  }

  insertInAppPurchase(type:string, title:string, trans:{
      transactionId: string;
      receipt: string;
      signature: string;
      productType: string;
    }, status:boolean, element:any){

    let today = this.getCurrentDate();
    console.log("Que nos llega",element[0]);
    let itemsCarrito = [];
    //this.itemsCarrito = this.buildBodyJson();
    let item = {
      "type": "carrito_compra",
      "title":element[0].name,
      "field_cantidad_articulo":[{"value":element[0].amount}],
      "field_costo_articulo":[{"value":element[0].field_costo}],
      "field_costo_total":[{"value":(element[0].field_costo*element[0].amount)}],
      "field_moneda":[{"value":(element[0].field_moneda)?element[0].field_moneda:"USD"}],
      "field_nombre_articulo":[{"value":element[0].name}],
      "field_tour":[{"target_id":element[0].nid}],
      "field_audio":[{"target_id":element[0].mid}]
    };
    itemsCarrito.push(item);

    //get platform
    let _plat = "";
    if(this.platform.is("ios"))
      _plat = "ios";
    if(this.platform.is("android"))
      _plat = "android";

    let datos =  {
      "type":type,
      "title":title,
      "field_transactionid":[{"value":trans.transactionId}],
      "field_receipt":[{"value":trans.receipt}],
      "field_signature":[{"value":trans.signature}],
      "field_producttype":[{"value":trans.productType}],
      "field_platform":[{"value":_plat}],
      "field_status":[{"value":status}],
      "field_fecha_comprado":[{"value":today}],
      "field_elementos":itemsCarrito
    };
    console.log("checkout",datos);
    //console.log("RES:",trans.receipt);
    //console.log("SING:",trans.signature);
    //console.log("TYPE:",trans.productType);
    //console.log("PLAT:",_plat);
    return this.http.post(
      this.co.API+'user/checkout?_format=json',
      JSON.stringify(datos)).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
            console.log(err);
          }
        )
      );
  }

  //funcion que arma el json con los items seleccionados para la compra
  buildBodyJson(){
    let item :any;
    let itemsCarrito = [];
    this.audioNodes.forEach( function(obj) {
      item = {
        "type": "carrito_compra",
        "title":obj.name,
        "field_cantidad_articulo":[{"value":obj.amount}],
			  "field_costo_articulo":[{"value":obj.field_costo}],
			  "field_costo_total":[{"value":(obj.field_costo*obj.amount)}],
			  "field_nombre_articulo":[{"value":obj.name}],
			  "field_tour":[{"target_id":obj.nid}],
        "field_audio":[{"target_id":obj.mid}]
      };
      itemsCarrito.push(item);
    });
    return itemsCarrito;
   // console.log("objeto completo",this.itemsCarrito);
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

  activateDreamJordanTour(nid){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json'
    });
    let datos = {
      "type": [{
        "target_id": "checkout"}],
        "field_status":[{"value":1}]  
    };

    return this.http.patch(
      this.co.API+'node/'+nid+'?_format=json',
      JSON.stringify(datos),
      { headers: headers}).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
            console.log(err);
          }
        )
      );
  }

  validateCoupon(coupon:string){
    return this.http.get<Array<any>>(this.co.API+'api/cupones/'+coupon+'?_format=json').pipe(
      map(
        res => { 
          return res;
        },
        (err: HttpErrorResponse) => { 
          console.log(err);
        }
      )
    );
  }

  canjeaCupon(node){
    /* let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    }); */
    let datos = {
      "type": [{
        "target_id": "cupones_app"}],
        "field_canjeado":[{"value":1}]  
    };
    //console.log("HEADERS",headers);
    console.log("BODY",datos);
    return this.http.patch(
      this.co.API+'node/'+node+'?_format=json',
      JSON.stringify(datos)).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
            console.log(err);
          }
        )
      );
  }

}