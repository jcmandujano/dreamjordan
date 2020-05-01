import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonService } from '../api/common.service';
import { TranslateService } from '@ngx-translate/core';
import {Howl} from 'howler';
import { TouchSequence } from 'selenium-webdriver';


@Injectable({
  providedIn: 'root'
})
export class TourService {
  actualplayer:Howl = null;
  actualaudiosArray:any[] = [];

  set audiosArray(val){
    console.log('setting audiolist');
    this.stopAllAudios();
    this.actualaudiosArray = val;
  }
  get audiosArray(){ return this.actualaudiosArray; }

  stopAllAudios(){
    console.log('stopall',this.audiosArray);
    if(this.audiosArray.length > 0)
    this.actualaudiosArray.forEach(element => {     
       element.audioelement.stop();   
       element.isPlaying=false;
      });
  }

  clearAudios(){
    this.stopAllAudios();
    this.actualaudiosArray = [];
  }

  constructor( public http: HttpClient,
    public co: CommonService,
    private translate: TranslateService
    ) { }

    set player(val){ console.log('setting player',val); if (this.actualplayer) this.stopAllAudios(); this.actualplayer = val; };
    get player(){ console.log('getting player',this.actualplayer); return this.actualplayer; }


    getToursByCountry(id_pais){
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
      return this.http.get<Array<any>>(this.co.API+'api/tours-app/'+ id_pais +'/'+ nid+'?_format=json').pipe(
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

    getPaises(){
       return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/paises-app/?_format=json').pipe(
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

    getDreamJordanTours(){
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

    getSliderTours(){
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
    getDreamJordanTourDetail(nid){
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