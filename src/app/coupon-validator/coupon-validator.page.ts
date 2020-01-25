import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-coupon-validator',
  templateUrl: './coupon-validator.page.html',
  styleUrls: ['./coupon-validator.page.scss'],
})
export class CouponValidatorPage implements OnInit {

  isValid : boolean = false;
  constructor(public user : UserService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
     if(this.user.account.current_user){
      console.log("Ya tenemos a alguieen");
    }else{
      console.log("no hay nadie logeado");
    }
  }

  validate(){
    this.isValid = true
  }

}
