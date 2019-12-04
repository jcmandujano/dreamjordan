import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dreamjordan-detail',
  templateUrl: './dreamjordan-detail.page.html',
  styleUrls: ['./dreamjordan-detail.page.scss'],
})
export class DreamjordanDetailPage implements OnInit {

  isValid : boolean = false;
  isActivated: boolean = false;
  constructor() { }

  ngOnInit() {
  }

  validate(param:boolean){
    this.isValid = param;
  }

  activate(){
    this.isActivated = true;
  }

}
