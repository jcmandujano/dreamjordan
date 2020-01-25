import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dreamjordan-plans',
  templateUrl: './dreamjordan-plans.page.html',
  styleUrls: ['./dreamjordan-plans.page.scss'],
})
export class DreamjordanPlansPage implements OnInit {
  DreamJordanTours:any;
  constructor(private router:Router,
    public tourService:TourService,
    public co: CommonService,
    ) { }

  ngOnInit() {
    this.co.showLoader();
    this.tourService.getDreamJordanTours().subscribe(res => { 
      this.co.hideLoader();
      this.DreamJordanTours = res;
      console.log("toursDreamJordan",res);
    },
    (err: HttpErrorResponse) => { 
      this.co.hideLoader();
      console.log("error",err);
    });
  }

  tourDetail(nid){
    this.router.navigate(['/tabs/dreamjordan-detail/'+nid]);
  }

  buy(){
    console.log("Comprameeee!");
  }

}
