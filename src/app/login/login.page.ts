import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute} from '@angular/router';
import { FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';
import { CommonService } from '../api/common.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  data: any;
  login_data = new FormGroup({
    email: new FormControl(null,Validators.required),
    password: new FormControl(null,Validators.required)
  });


  constructor(private router:Router, 
    public user : UserService, 
    private route: ActivatedRoute,
    public co: CommonService) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.origin;
        console.log("que paso aca" , this.data);
      }
    });
  }

  ngOnInit() {
  }

  doLogin(data){
    this.co.showLoader();
    this.user.login(data.email,data.password).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.user.account = res;
        this.router.navigate(['/tabs/home']);
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
  }

}
