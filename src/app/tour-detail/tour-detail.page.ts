import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tour-detail',
  templateUrl: './tour-detail.page.html',
  styleUrls: ['./tour-detail.page.scss'],
})
export class TourDetailPage implements OnInit {

  comprado:boolean = false;  
  constructor() { }

  ngOnInit() {
  }

  buy(flag:boolean){
    console.log("Compramee!! " + flag);
    this.comprado = flag;
  }

}
