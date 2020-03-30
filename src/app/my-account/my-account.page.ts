import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  lang:string="es";
  email:string="";
  constructor(
    public user : UserService, 
    public co: CommonService,
    private translateService: TranslateService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    
    console.log("Account",this.user.account);
    if(this.user.account === undefined){
      this.co.showLoader();
      this.user.getLoginStatus().subscribe(res => { 
        console.log("SESSION_STATUS",res);
        this.user.account = res;
        this.co.hideLoader();
        if(this.user.account.current_user){
          this.email = this.user.account.current_user.email;
          console.log("Ya tenemos a alguieen1 ",res);
        }
      },
      (err: HttpErrorResponse) => { 
        this.co.hideLoader();
        console.log("error",err);
      }); 
    }else{
      this.email = this.user.account.current_user.email;
    }

  }

  choose() {
    console.log("IDIOMAAA",this.lang);
    if(this.user.account.current_user!=null){
      this.updateLang();
    }else{
      this.translateService.use(this.lang);
    }
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