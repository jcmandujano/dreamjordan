import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core'
@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.page.html',
  styleUrls: ['./my-account.page.scss'],
})
export class MyAccountPage implements OnInit {

  lang:string="es";
  constructor(
    public user : UserService, 
    public co: CommonService,
    private translateService: TranslateService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    
    if(this.user.account === undefined){
      this.co.showLoader();
      this.user.getLoginStatus().subscribe(res => { 
        this.user.account = res;
        this.co.hideLoader();
        if(this.user.account.current_user){
          console.log("Ya tenemos a alguieen1 ",res);
        }
      },
      (err: HttpErrorResponse) => { 
        this.co.hideLoader();
        console.log("error",err);
      }); 
    }

  }

  choose() {
    console.log("IDIOMAAA",this.lang);
    this.translateService.use(this.lang);
  }

}
