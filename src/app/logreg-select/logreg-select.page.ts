import { Component, OnInit } from '@angular/core';
import {Router,ActivatedRoute, NavigationExtras} from '@angular/router';

@Component({
  selector: 'app-logreg-select',
  templateUrl: './logreg-select.page.html',
  styleUrls: ['./logreg-select.page.scss'],
})
export class LogregSelectPage implements OnInit {
  data: any;
  constructor(private router:Router,private route: ActivatedRoute) { 
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.origin;
      }
    });
  }

  ngOnInit() {
  }

  nextPage(){
    this.router.navigate(['/login']);
  }

  doLogin(){
    let navigationExtras: NavigationExtras = {
      state: {
        origin: "validaCupon"
      }
    };
    
    this.router.navigate(['/login'],navigationExtras);
  }

  doRegister(){
    console.log("aca nos vamos a registrar");
  }

  cancel(){
    console.log("vamos para atras");  
    this.router.navigate(['/tabs/home']);
  }

}
