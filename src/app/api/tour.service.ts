import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonService } from '../api/common.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor( public http: HttpClient,
    public co: CommonService,
    private translate: TranslateService) { }

    getToursByCountry(id_pais){
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/tours-app/'+ id_pais +'?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+'api/tours-app/'+ id_pais +'/'+ nid+'?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/audiosxtour/'+ nid +'?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/djtours-app/1/?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/home-tours/?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/djtours-app/1/'+nid+'?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+'api/audios-dream-jordan/'+nid+'?_format=json',{ withCredentials: true }).pipe(
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