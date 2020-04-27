import { Component } from '@angular/core';
import {UserService} from '../../app/api/user.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage  {
  currentUser:any;
  sessionState:boolean;
  constructor(public user : UserService,
    private storage : StorageService) { }
    
  ionViewWillEnter(){
    this.user.customLoginStatus().then(data => {
      //console.log("USUARIO DESDE TABS",data);
      if(data!= null){
        this.currentUser=data;
      }
      this.user.authenticationState.subscribe(state => {
        if (state) {
          this.sessionState=state;
          //console.log("user is logged in ", state);
        } else {
          this.sessionState=state;
          //console.log("user is NOT logged in ",state);
        }
      });
    });
  }

}
