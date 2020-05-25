import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import { CommonService } from '../api/common.service';
import { StorageService } from '../storage.service';
import { CartService } from '../api/cart.service';
import { BehaviorSubject } from 'rxjs';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  data: any;
  login_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });
  cart=[];
  cartItemCount: BehaviorSubject<number>;

  constructor(private router:Router, 
    public user : UserService, 
    public alertController: AlertController, 
    private route: ActivatedRoute,
    public storage: StorageService,
    private cartserv : CartService,
    public co: CommonService) { 
      this.cartItemCount = this.cartserv.getCartItemCount();
      this.cart = this.cartserv.getCart();
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.origin;
        console.log("que paso aca" , this.data);
        
      }
    });
  }

  doLogin(data){
    this.co.showLoader();
    this.user.login(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        //this.user.account = res;
        this.user.userData={
          user:res.current_user.name,
          pass:data.password
        };
        this.storage.setObject('userdata',{
          user:res.current_user.name,
          pass:data.password,
          lang:res.current_user.lang,
          token:res.csrf_token
        });
        this.router.navigate(['/tabs/home']);
      },
      (err: HttpErrorResponse) => { 
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        this.co.presentAlert('Error','¡UPS!, hubo un problema al iniciar sesión.',message);
      }
    );
  }

  registrar(){
    this.router.navigate(['/tabs/registro']);
  }

  cancel(){
    this.router.navigate(['/tabs/home']);
  }

  async requestTempPass(){
      const alert = await this.alertController.create({
        header: 'Solicitar Cambio de Contraseña',
        message: "Ingresa tu correo para enviarte las indicaciones para recuperar tu contraseña",
        inputs: [
          {
            name: 'email',
            placeholder: 'Email'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: (resp) => {
              console.log('Confirm Ok', resp.email);
              this.requestResetPassword(resp.email);
            }
          }
        ]
      });
      await alert.present();
  }

  requestResetPassword(email:string){
    this.co.showLoader();
    this.user.requestResetPassword(email).subscribe((res:any)=>{
      this.co.hideLoader();
      console.log("respuesta",res);
    },
    (err:HttpErrorResponse) =>{
      this.co.hideLoader();
      var message = err.error.message;
      if(err.status == 40){
        message = 'Correo electrónico o contraseña no reconocidos.';
      }
      console.log("error",err);
    });
  }


}
