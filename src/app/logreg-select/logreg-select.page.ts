import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-logreg-select',
  templateUrl: './logreg-select.page.html',
  styleUrls: ['./logreg-select.page.scss'],
})
export class LogregSelectPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  nextPage(){
    this.router.navigate(['/login']);
  }

}
