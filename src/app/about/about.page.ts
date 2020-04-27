import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../api/common.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  body:any;
  title:any;
  constructor(public user : UserService,
    public co : CommonService) { }

  ngOnInit() {
    this.co.showLoader();
    this.user.getpage(393).subscribe(res => { 
      this.co.hideLoader();
      this.title=res[0].title;
      this.body=res[0].body;
    }, 
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      this.co.presentAlert("Error","","Ocurrio un error al recuperar la información");
      console.log("error",err);
    });
  }

}
