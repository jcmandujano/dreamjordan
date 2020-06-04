import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { CartService } from '../../api/cart.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  ngOnInit() {}

  cart=[];
  cartItemCount: BehaviorSubject<number>;
 


  constructor(private router:Router,
    private cartserv : CartService) {
      this.cartItemCount = this.cartserv.getCartItemCount();
      this.cart = this.cartserv.getCart();
     }
     
  
  openCart(){
    this.router.navigate(['/tabs/my-cart']);
  }
  
  goToHome(){
    this.router.navigate(['/tabs/home']);
  }

}
