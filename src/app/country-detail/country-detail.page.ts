import { Component } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../api/user.service';

@Component({
  selector: 'app-country-detail',
  templateUrl: './country-detail.page.html',
  styleUrls: ['./country-detail.page.scss'],
})
export class CountryDetailPage {
  idPais: any;
  paisSelecc : any;
  tours:any;
  constructor(public router:Router,
    public tourService:TourService,
    public user : UserService,
    public co: CommonService,
    public active : ActivatedRoute) { 
      this.idPais = this.active.snapshot.paramMap.get("id");

  }

  ionViewDidEnter() {
    this.co.showLoader();
    this.tourService.getToursByCountry(this.idPais).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.tours = res;
      },
      (err: HttpErrorResponse) => { 
        //console.log(err);
        this.co.hideLoader();
        let message = err.error.message;
        if(err.status == 400){
          message = '.';
        }
        this.co.presentAlert('Error','Hubo un problema al recuperar la información.',message);
      }
    );

    this.user.getPaisById(this.idPais).subscribe(res => { 
      this.co.hideLoader();
      this.paisSelecc = res[0];
      console.log("elemento",this.paisSelecc);
    },
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      console.log("error",err);
    });
  }

  tourDetail(nid){
    this.router.navigate(['/tabs/tour-detail/'+this.idPais+'/'+nid]);
  }


}
