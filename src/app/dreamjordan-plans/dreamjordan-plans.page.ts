import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-dreamjordan-plans',
  templateUrl: './dreamjordan-plans.page.html',
  styleUrls: ['./dreamjordan-plans.page.scss'],
})
export class DreamjordanPlansPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  tourDetail(){
    this.router.navigate(['/tabs/tour-detail']);
  }

  buy(){
    console.log("Comprameeee!");
  }

}
