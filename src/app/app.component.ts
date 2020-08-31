import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {UserService} from '../app/api/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import {CommonService} from '../app/api/common.service';
import { StorageService } from './storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  
  currentUser:any;
  sessionState:boolean;
  ///localItems : Item[]  = [];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router:Router, 
    private storage : StorageService,
    public user : UserService,
    public co :CommonService, 
    private translateService: TranslateService
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.translateService.setDefaultLang('es'); 
    this.translateService.use('es');    
    this.platform.ready().then(() => { 
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.user.customLoginStatus().then(data => {
        //console.log("USUARIO DESDE APP.COMPONENT",data);
        if(data!= null){
          this.user.userData={
            user:data.user,
            pass:data.pass
          };
          this.currentUser=data;
          this.translateService.setDefaultLang(this.currentUser.lang); 
          this.translateService.use(this.currentUser.lang);
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
      this.platform.pause.subscribe(() => {        
        console.log('PAUSADO');
      });  
    });
  }

  doLogout(){
    this.storage.remove("userdata");
    this.user.userData= null;
    this.user.customLoginStatus().then(data => {
      this.user.authenticationState.subscribe(state => {
          this.sessionState=state;
      });
    });
    this.co.presentAlert("Correcto","","Su sesión se ha cerrado correctamente"); 
    this.router.navigate(['/tabs/home']);
  }

  
} 