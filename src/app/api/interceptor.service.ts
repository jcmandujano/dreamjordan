import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { StorageService } from '../storage.service';
import { toBase64String } from '@angular/compiler/src/output/source_map';
import { UserService } from './user.service';


@Injectable()
export class InterceptorService implements HttpInterceptor{

  constructor(
    private storage: StorageService,
    private user:UserService){}
  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let encabezados : any = {
      'Content-Type':'application/json'
    }
    //console.log("data",this.user);
    if(this.user.userData!=null){
      encabezados = {
        'Content-Type':'application/json',
        "Authorization":"Basic "+btoa(this.user.userData.user+':'+this.user.userData.pass)
      }
    }
    
    const auth = req.clone({
      url: req.url,
      setHeaders:encabezados
    });
    return next.handle(auth).pipe(finalize( () => {
      //console.log("Termina el interceptor",auth);
    }));
  }
}