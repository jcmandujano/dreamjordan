import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

export interface Account{
  csrf_token: string;
  logout_token: string;
  current_user: CurrentUser;
  temp_login: boolean;
  last_login: string
}

export interface CurrentUser{
  name: string;
  uid: string;
  email: string;
  fullname: string;
  //payment_methods: Array<PaymentMethod>;
}

@Injectable({
  providedIn: 'root'
})

export class UserService {

  API: string = 'https://dream-jordan.com/';
  private _account:Account;

  get account(): Account{
    return this._account;
  }
  set account(account: Account){
    this._account = account;
  }

  constructor(
    public http: HttpClient,
    public alertController: AlertController,
    public router: Router
  ) { }

  getLoginStatus(){
    return this.http.get<Account>(this.API+'user/me/null?_format=json',{ withCredentials: true }).pipe(
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
      this.API+'user/clogin?_format=json',
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
      this.API+'user/clogout?_format=json',
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

}