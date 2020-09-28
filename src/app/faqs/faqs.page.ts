import { Component, OnInit } from '@angular/core';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonService } from '../api/common.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FAQsPage implements OnInit {
  body:any;
  title:any;
  lang:string="es";
  constructor( public user : UserService,
              public co : CommonService,
              private translateService: TranslateService) { }

  ngOnInit() {
    this.co.showLoader();
    this.user.getpage(392).subscribe(res => { 
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

  choose() {
    
    this.translateService.use(this.lang);
    
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
