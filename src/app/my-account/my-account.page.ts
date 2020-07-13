import { Component } from '@angular/core';
import { UserService } from '../api/user.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage  {

  lang:string="es";
  email:string="";
  currentUser:any;
  sessionState:boolean;
  constructor(
    public user : UserService, 
    public co: CommonService,
    private translateService: TranslateService) { }

  ionViewWillEnter(){
    
    this.user.customLoginStatus().then(data => {
      console.log("USUARIO DESDE MY ACCOUNT",data);
      if(data!= null){
        this.currentUser=data;
        console.log("Account",this.currentUser);
      }
      this.user.authenticationState.subscribe(state => {
        if (state) {
          this.sessionState=state;
          console.log("user is logged in ", state);
        } else {
          this.sessionState=state;
          console.log("user is NOT logged in ",state);
        }
      });
    });

  }

  choose() {
  /*   console.log("IDIOMAAA",this.lang);
    if(this.currentUser !=null){
      this.updateLang();
    }else{ */
      this.translateService.use(this.lang);
    //}
  }

  updateLang(){
    this.co.showLoader();
    this.user.updateLang(this.lang).subscribe(res => { 
      console.log("UPDATED",res);
      this.translateService.use(this.lang);
      this.co.hideLoader();
    },
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      console.log("error",err);
    }); 
  }
}