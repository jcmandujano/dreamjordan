import { Component, OnInit } from '@angular/core';
import { CommonService } from '../api/common.service';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {Router,ActivatedRoute} from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UserService } from '../api/user.service';
import { StorageService } from '../storage.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  login_data = new FormGroup({
    email: new FormControl(),
    temp_password: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required),
  });

  variableEmail = "" ;
  hideMe = true;
  tokenSended:boolean = false;

  constructor(
    public alertController: AlertController, 
    private route: ActivatedRoute,
    public user : UserService, 
    public storage: StorageService,
    private router:Router, 
    public co: CommonService
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    console.log("viewWillEnter");
    this.getTempData();
  }

  getTempData(){
    this.storage.getObject("tempData").then(data => {
      console.log("Datos en local", data);
      if(data!=null){
        this.variableEmail = data.email;
        this.tokenSended = true;
       }else{         
        this.tokenSended = false;
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
        console.log(err);
        this.co.hideLoader();
        var message = err.error.message;
        if(err.status == 400){
          message = 'Correo electrónico o contraseña no reconocidos.';
        }
        if(err.status == 403){
          message = 'Demasiados intentos fallidos de inicio de sesión desde su dirección IP. Esta dirección IP está bloqueada temporalmente.';
        }
        this.co.presentAlert('Error','',message);
      }
    );
  }

  /*async requestTempPass(){
    const alert = await this.alertController.create({
      header: 'Solicitar Cambio de Contraseña',
      //message: "Ingresa tu correo para que las indicaciones para recuperar tu contraseña",
      message: "Ingresa tu correo para obtener tu token temporal",
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
            ///this.variableEmail= resp.email;            
            this.storage.setObject('tempData',{
              email:resp.email
            });
            this.getTempData();
            //this.hideMe = true;
            this.requestResetPassword(resp.email);
          }
        }
      ]
    });
    await alert.present();
}*/

  requestResetPassword(){ 
    this.co.showLoader();
    this.user.requestResetPassword(this.variableEmail).subscribe((res:any)=>{
      this.co.hideLoader();
      this.storage.setObject('tempData',{
        email:this.variableEmail
      });
      this.getTempData();
      //console.log("respuesta",res);
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

  saveNewPassword(){

    this.co.showLoader();
    let datos= this.login_data.value;
    this.user.saveNewPassword(datos.email, datos.temp_password, datos.password).subscribe((res:any)=>{
      this.co.hideLoader();
      console.log("respuesta",res);
      this.storage.remove('tempData');
      this.co.presentAlert("Correcto","","Se ha actualizado su información");
      this.variableEmail="";
      this.doLogin(datos);
    },
    (err:HttpErrorResponse) =>{
      this.co.hideLoader();
      var message = err.error.message;
      if(err.status == 400){
        message = 'Correo electrónico o contraseña no reconocidos.';
      }
      console.log("error",err);
    });
  }

  clearAttemp(){
    this.storage.remove("tempData");
    this.getTempData();
    this.variableEmail="";
  }

  cancel(){
    this.router.navigate(['/tabs/home']);
  }
}
