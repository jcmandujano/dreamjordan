import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TourService} from '../api/tour.service';
import { CommonService } from '../api/common.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dreamjordan-detail',
  templateUrl: './dreamjordan-detail.page.html',
  styleUrls: ['./dreamjordan-detail.page.scss'],
})
export class DreamjordanDetailPage implements OnInit {
  id_tour:any;
  current_tour:any;
  isValid : boolean = false;
  isActivated: boolean = false;
  audiosList:any;
  constructor(public active :ActivatedRoute,
    public tourService:TourService,
    public co: CommonService) { 
    this.id_tour = this.active.snapshot.paramMap.get("id");
    //console.log("quepaso",this.id_tour);
  }

  ngOnInit() {
    this.co.showLoader();
    this.tourService.getDreamJordanTourDetail(this.id_tour).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.current_tour = res[0];
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
    this.tourService.getDreamJordanAudios(this.id_tour).subscribe(
      (res:any) => { 
        this.co.hideLoader();
        this.audiosList = res;
        console.log("audios",this.audiosList);
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
  }

  validate(param:boolean){
    this.isValid = param;
  }

  activate(){
    this.isActivated = true;
  }

}
