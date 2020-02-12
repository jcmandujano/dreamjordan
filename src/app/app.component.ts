import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {StorageService, Item} from '../app/api/storage.service';
import {UserService} from '../app/api/user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appPages = [{
    title: 'Sobre Dream Jordan',
    url: 'tabs/about',
    icon:'information-circle'
    },
    {
      title: 'F.A.Q.',
      url: 'tabs/faq',
      icon:'help-circle'
    },
    {
      title: 'Contacto',
      //url: 'tabs/contact',
      url: '#',
      icon:'mail'
    },
    {
      title: 'Mi cuenta',
      //url: 'tabs/my-account',
      url: '#',
      icon:'person'
    }
  ];
  localItems : Item[]  = [];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage : StorageService,
    public user : UserService
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      if(this.user.account === undefined){
        this.user.getLoginStatus().subscribe(res => { 
          this.user.account = res;
          if(this.user.account.current_user){
            console.log("Ya tenemos a alguieen1 ",res);
            this.appPages.push({
              title: 'Cerrar sesion',
              url: 'tabs/logout',
              icon:'close-circle'
            });
          }else{
            console.log("no hay nadie");
            this.appPages.push({
              title: 'Ingresar',
              url: 'login',
              icon:'close-circle'
            });
          }
        },
        (err: HttpErrorResponse) => { 
          console.log("error",err);
        }); 
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.pause.subscribe(() => {        
        console.log('PAUSADO');
      });  
    });
  }

  
}