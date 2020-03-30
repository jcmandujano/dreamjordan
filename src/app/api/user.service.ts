import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { CommonService } from '../api/common.service';
import { TranslateService } from '@ngx-translate/core';

export interface Account{
  csrf_token: string;
  logout_token: string;
  current_user: CurrentUser;
}

export interface CurrentUser{
  uid: string;
  name: string;
  email: string;
  lang: string;
  //payment_methods: Array<PaymentMethod>;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private _account:Account;

  get account(): Account{
    return this._account;
  }
  set account(account: Account){
    this._account = account;
  }

  constructor(
    public http: HttpClient,
    public co: CommonService,
    private translate: TranslateService
  ) { }

  getLoginStatus(){
    return this.http.get<Account>(this.co.API+'user/me/null?_format=json',{ withCredentials: true }).pipe(
      map(
        res => { 
          return res;
        },
        (err: HttpErrorResponse) => { 
          //console.log("provema",err);
        }
      )
    );
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
      { headers: headers, withCredentials: true }).pipe(
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
      { headers: headers, withCredentials: true }).pipe(
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

  logout(){
    return this.http.get<Account>(
      this.co.API+'user/clogout?_format=json',
      { withCredentials: true }).pipe(
        map(
          res => { 
            return res;
          },
          (err: HttpErrorResponse) => { 
            //console.log(err);
          }
        )
      );
  }

  getPaises(){
   // console.log("que",this.translate.currentLang)
    return this.http.get<Array<any>>(this.co.API+'api/'+this.translate.currentLang+'/paises-app/?_format=json',{ withCredentials: true }).pipe(
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

  getPaisById(idPais){
    return this.http.get<Array<any>>(this.co.API+'api/'+this.translate.currentLang+'/paises-app/'+idPais+'?_format=json',{ withCredentials: true }).pipe(
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
    let cartiems=new Array;
    return this.http.get<Array<any>>(this.co.API+this.translate.currentLang+'/user/checkout_app?_format=json',{ withCredentials: true }).pipe(
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
  }

  getPurchaseInfo(){
    return this.http.get<Array<any>>(this.co.API+'user/checkout_app?_format=json',{ withCredentials: true }).pipe(
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
    return this.http.get<Array<any>>(this.co.API+'user/checkout_app?_format=json',{ withCredentials: true }).pipe(
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
      'Content-Type':  'application/json',
      'X-CSRF-Token': this.account.csrf_token

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
}