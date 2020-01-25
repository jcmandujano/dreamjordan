import { Component, OnInit } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import { CommonService } from '../api/common.service';
import { UserService } from '../api/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.page.html',
  styleUrls: ['./countries.page.scss'],
})
export class CountriesPage implements OnInit {
  paises : any;
  skeletons:any;
  constructor(private router:Router,
    public user : UserService, 
    public co: CommonService) { }

  ngOnInit() {
    //recuperamos paises
    this.co.showLoader();
    this.user.getPaises().subscribe(res => { 
      this.co.hideLoader();
      this.paises = res;
      //console.log("paises",res);
    },
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      console.log("error",err);
    });
  }

  countryDetail(idPais){
    this.router.navigateByUrl('/tabs/country-detail/'+idPais);
  }
  

}
