import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonService } from '../api/common.service';


@Injectable({
  providedIn: 'root'
})
export class TourService {

  constructor( public http: HttpClient,
    public co: CommonService,) { }

    getToursByCountry(id_pais){
      return this.http.get<Array<any>>(this.co.API+'es/api/tours-app/'+ id_pais +'?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+'es/api/tours-app/'+ id_pais +'/'+ nid+'?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+'es/api/audiosxtour/'+ nid +'?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+'es/api/dream-jordan-tour/?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+'es/api/dream-jordan-tour/'+nid+'?_format=json',{ withCredentials: true }).pipe(
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
      return this.http.get<Array<any>>(this.co.API+'/es/api/audios-dream-jordan/'+nid+'?_format=json',{ withCredentials: true }).pipe(
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