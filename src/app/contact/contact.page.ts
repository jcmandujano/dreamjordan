import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../api/common.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {
  body:any;
  title:any;
  constructor(public user : UserService,
    public co : CommonService) { }

  ngOnInit() {
    this.co.showLoader();
    this.user.getpage(394).subscribe(res => { 
      this.co.hideLoader();
      this.title=res[0].title;
      this.body=res[0].body;
      console.log("DATA",res);
    }, 
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      this.co.presentAlert("Error","","Ocurrio un error al recuperar la información");
      console.log("error",err);
    });
  }

}
