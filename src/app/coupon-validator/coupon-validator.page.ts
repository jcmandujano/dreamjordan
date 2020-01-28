import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-coupon-validator',
  templateUrl: './coupon-validator.page.html',
  styleUrls: ['./coupon-validator.page.scss'],
})
export class CouponValidatorPage implements OnInit {
  showLogin:boolean;
  showRegister:boolean = false;
  showValidator:boolean = false;
  muestraLogin: boolean = true;
  isValid : boolean = false;

  login_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });

  register_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });
  constructor(public user : UserService,
    public co: CommonService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    if(this.user.account === undefined){
      this.co.showLoader();
      this.user.getLoginStatus().subscribe(res => { 
        this.user.account = res;
        console.log("resp",res);
        this.co.hideLoader();
        if(this.user.account.current_user){
          this.showValidator = true;
        }
      },
      (err: HttpErrorResponse) => { 
        this.co.hideLoader();
        console.log("error",err);
      }); 
    }
  }

  validate(){
    this.isValid = true
  }

  muestraRegistro(){
    this.muestraLogin = false;
    this.showRegister  = true;
  }

  doLogin(data){
    this.co.showLoader();
    this.user.login(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.user.account = res;
        this.showValidator = true;
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','¡UPS!, hubo un problema al iniciar sesión.',message);
      }
    );
    //console.log("datos",data);
  }

  register(data){
    this.co.showLoader();
    this.user.register(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.user.account = res;
        this.showValidator = true;
        this.showRegister = false;
        this.doLogin(data);
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','¡UPS!, hubo un problema al registrar el usuario.',message);
      }
    );
    console.log("datos",data);
  }

}