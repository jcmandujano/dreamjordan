import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-lang-selec',
  templateUrl: './lang-selec.page.html',
  styleUrls: ['./lang-selec.page.scss'],
})
export class LangSelecPage implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }

  nextPage(){
    this.router.navigate(['/logreg-select']);
  }

}
