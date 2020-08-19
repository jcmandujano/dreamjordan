import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonService } from '../api/common.service';
import { TranslateService } from '@ngx-translate/core';
import {StorageService} from '../storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { NetworkService, ConnectionStatus } from "./network.service";


export interface Account{
  csrf_token: string;
  logout_token: string;
  current_user: CurrentUser;
}

export interface CurrentUser{
  uid: string;
  name: string;
  pass: string;
  email: string;
  lang: string;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  authenticationState = new BehaviorSubject(false);
  private _account:Account;
  private _userData:{
    user:string;
    pass:string;
  } = null;

  get account(): Account{
    return this._account;
  }
  set account(account: Account){
    this._account = account;
  }

  get userData() : { user:string;pass:string;}{
    return this._userData;
  }
  set userData(userData: { user:string;pass:string;}){
    this._userData = userData;
  }

  constructor(
    public http: HttpClient,
    public co: CommonService,
    private network : NetworkService,
    public storage : StorageService,
    private translate: TranslateService
  ) { }

  customLoginStatus(){
    return this.storage.getObject("userdata").then(data => {
     if(data!=null){
      this.authenticationState.next(true);
       return data;
     }else{
       this.authenticationState.next(false);
       return data;
     }
    });
  }

  login(username:string,password:string){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
    });
    let datos =  {
      "name":username,
      "pass":password
    };
    return this.http.post<Account>(
      this.co.API+'user/clogin?_format=json',
      JSON.stringify(datos),
      { headers: headers }).pipe(
        map(
          res => { 
            this.authenticationState.next(true);
            return res;
          },
          (err: HttpErrorResponse) => { 
            console.log(err);
          }
        )
      );
  }

  register(username:string,password:string){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
    });
    let datos =  {
      "name":[{"value":username}],
      "mail":[{"value":username}],
      "pass":[{"value":password}]
    };
    console.log("data",datos);
    return this.http.post<Account>(
      this.co.API+'user/register?_format=json',
      JSON.stringify(datos),
      { headers: headers}).pipe(
        map(
          res => { 
            this.authenticationState.next(true);
            return res;
          },
          (err: HttpErrorResponse) => { 
            console.log(err);
          }
        )
      );
  }

  logout(){
    return this.http.get<Account>(
      this.co.API+'user/clogout?_format=json').pipe(
        map(
          res => { 
            console.log("Saliendo", res);
            this.authenticationState.next(false);
            return res;
          },
          (err: HttpErrorResponse) => { 
            //console.log(err);
          }
        )
      );
  }

  getPaisById(idPais):Observable<any>{
    if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Offline){
      console.log("Estamos offline");
    }else{
      console.log("estamos online");
    }
    return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/api/paises-app/'+idPais+'?_format=json').pipe(
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

  getPurchases(){
    if(this.network.getCurrentNetworkStatus() == ConnectionStatus.Online){
      let cartiems=new Array;
      return this.http.get<Array<any>>(this.co.API+'user/checkout_app?_format=json').pipe(
        map(
          res => { 
            let objeto = new Array;
            for(let i in res){
              objeto = JSON.parse(res[i].checkout_elements);
              for(let j in objeto){
                  cartiems.push(objeto[j]);
              }
            }
            return cartiems;
          },
          (err: HttpErrorResponse) => { 
            console.log(err);
          }
        )
      );
    }else{
      return null;
    }
    
  }

  getPurchaseInfo(){
    return this.http.get<Array<any>>(this.co.API+'user/checkout_app?_format=json').pipe(
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

  getProcessedItems(idtour, tipo){
    let cartiems=new Array;
    return this.http.get<Array<any>>(this.co.API+'user/checkout_app?_format=json').pipe(
      map(
        res => { 
          let objeto = new Array;
          for(let i in res){
            objeto = JSON.parse(res[i].checkout_elements);
            for(let j in objeto){
              if(objeto[j].tour == idtour){
                objeto[j].status=res[i].field_status;
                cartiems.push(objeto[j]);
              }
            }
          }
          return cartiems;
        },
        (err: HttpErrorResponse) => { 
          console.log(err);
        }
      )
    );
  }

  updateLang(lang:string){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json'

    });
    let datos =  {
      "preferred_langcode":[{"value":lang}]
    };
    console.log("headers",headers);
    console.log("Datos",datos);
    return this.http.patch<any>(this.co.API+'user/'+this.account.current_user.uid+'?_format=json',
    JSON.stringify(datos),{ headers: headers, withCredentials: true }).pipe(
      map(
        res => { 
          console.log("UPDATED LANG", res);
          return res;
        },
        (err: HttpErrorResponse) => { 
          console.log(err);
        }
      )
    );
  }

  getpage(nid){
    return this.http.get<Array<any>>(this.co.API+''+this.translate.currentLang+'/api/pages/'+nid+'?_format=json').pipe(
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

  requestResetPassword(email:string){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json'
    });
    let datos =  {
      "mail":email
    };
    return this.http.post<any>(this.co.API+'user/lost-password?_format=json',JSON.stringify(datos), { headers: headers }).pipe(
      map(
        res => { 
          console.log("UPDATED PASS", res);
          return res;
        },
        (err: HttpErrorResponse) => { 
          console.log(err);
        }
      )
    );
  }

  saveNewPassword(username:string, tempPass:string, newPass:string){
    let headers = new HttpHeaders({
      'Content-Type':  'application/json'
    });
    let datos =  {
      "name": username,
      "temp_pass":tempPass,
      "new_pass":newPass
    };
    return this.http.post<any>(this.co.API+'user/lost-password-reset?_format=json',
      JSON.stringify(datos), { headers: headers }).pipe(
      map(
        res => { 
          console.log("UPDATED PASS", res);
          return res;
        },
        (err: HttpErrorResponse) => { 
          console.log(err);
        }
      )
    );
  }
}