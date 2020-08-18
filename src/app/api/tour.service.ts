import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonService } from '../api/common.service';
import { TranslateService } from '@ngx-translate/core';
import { Howl } from 'howler';
import { Observable } from 'rxjs';
import { NetworkService, ConnectionStatus } from "./network.service";


@Injectable({
  providedIn: 'root'
})
export class TourService {
  actualplayer:Howl = null;
  actualaudiosArray:any[] = [];

  set audiosArray(val){
   // console.log('setting audiolist');
    this.stopAllAudios();
    this.actualaudiosArray = val;
  }
  get audiosArray(){ return this.actualaudiosArray; }

  stopAllAudios(){
    console.log('stopall',this.audiosArray);
    if(this.audiosArray.length > 0)
    console.log('stopall 2');
    this.actualaudiosArray.forEach(element => {
      console.log('element stop',element);     
      if(element.hasOwnProperty('audioelement')){
        console.log('hasauduoelement');
       element.audioelement.stop();   
       element.isPlaying=false;
      }
      });
  }

  clearAudios(){
    this.stopAllAudios();
    this.actualaudiosArray = [];
  }

  constructor( public http: HttpClient,
    public co: CommonService,
    private network : NetworkService,
    private translate: TranslateService
    ) { }

    set player(val){ console.log('setting player',val); if (this.actualplayer) this.stopAllAudios(); this.actualplayer = val; };
    get player(){ console.log('getting player',this.actualplayer); return this.actualplayer; }


    getToursByCountry(id_pais){
      console.log('getToursByCountry',this.co.API+this.translate.currentLang+'/api/tours-app/'+ id_pais +'?_format=json');
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/tours-app/'+ id_pais +'?_format=json').pipe(
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

    getSingleTour(id_pais, nid){
      console.log('getSingleTour',this.co.API+this.translate.currentLang+'/api/tours-app/'+ id_pais +'/'+ nid+'?_format=json');
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/tours-app/'+ id_pais +'/'+ nid+'?_format=json').pipe(
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

    updateDownloadFlag(nid, status){
      let datos =  {
        "type": [{
          "target_id": "carrito_compra"
        }],
      "field_descargado":[{"value":status}]
      };
      console.log("datos",datos);
       return this.http.patch<any>(this.co.API+'node/'+ nid+'?_format=json',
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

    updatePlays(nid, value){
      let datos =  {
        "type": [{
          "target_id": "carrito_compra"
        }],
      "field_plays":[{"value":value}]
      };
      console.log("datos",datos);
       return this.http.patch<any>(this.co.API+'node/'+ nid+'?_format=json',
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

    updatePositon(nid, value){
      let datos =  {
        "type": [{
          "target_id": "carrito_compra"
        }],
      "field_posicion":[{"value":value}]
      };
      console.log("datos",datos);
       return this.http.patch<any>(this.co.API+'node/'+ nid+'?_format=json',
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

    getAudiosxTour(nid){
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/audiosxtour/'+ nid +'?_format=json').pipe(
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

    getPurchasedAudios(nid){
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/audiosxtour/'+ nid +'?_format=json').pipe(
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

    getPaises():Observable<any>{
      if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Offline){
        console.log("recuperando local");
        return this.http.get('../assets/data/paises.json').pipe(
          map(
            res => { 
              console.log("local json",res["countries"]);
              return res;
            },
            (err: HttpErrorResponse) => { 
              console.log(err);
            }
          )
        );
      }else{
        console.log('paises online',this.co.API+this.translate.currentLang+'/api/paises-app/?_format=json');
        return this.http.get(this.co.API+this.translate.currentLang+'/api/paises-app/?_format=json').pipe(
          map(
            res => { 
              console.log("paises");
              return res;
            },
            (err: HttpErrorResponse) => { 
              console.log(err);
            }
          )
        );
      }
       
     }l

    getDreamJordanTours(){
      if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Offline){
        //console.log("recuperando local");
        return this.http.get('../assets/data/djtours.json').pipe(
          map(
            res => { 
              console.log("local json",res["countries"]);
              return res;
            },
            (err: HttpErrorResponse) => { 
              console.log(err);
            }
          )
        );
      }else{
        return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/djtours-app/1/?_format=json').pipe(
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

    getSliderTours(){
      if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Offline){
        //console.log("recuperando local");
        return this.http.get('../assets/data/slider.json').pipe(
          map(
            res => { 
              console.log("local json",res["countries"]);
              return res;
            },
            (err: HttpErrorResponse) => { 
              console.log(err);
            }
          )
        );
      }else{
        return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/home-tours/?_format=json').pipe(
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
    getDreamJordanTourDetail(nid){
      console.log('getDJTD', this.translate.currentLang);
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/djtours-app/1/'+nid+'?_format=json').pipe(
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

    getDreamJordanAudios(nid){
      return this.http.get<Array<any>>(this.co.API+'api/audios-dream-jordan/'+nid+'?_format=json').pipe(
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