import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import {StorageService, Item} from '../app/api/storage.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Sobre Dream Jordan',
      url: '#',
      icon:'information-circle'
    },
    {
      title: 'F.A.Q.',
      url: '#',
      icon:'help-circle'
    },
    {
      title: 'Contacto',
      url: '#',
      icon:'mail'
    },
    {
      title: 'Mi cuenta',
      url: '#',
      icon:'person'
    },
    {
      title: 'Cerrar sesion',
      url: '#',
      icon:'close-circle'
    }
  ];
  localItems : Item[]  = [];
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage : StorageService
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.pause.subscribe(() => {        
        console.log('PAUSADO');
        //Same logic
      });  
    });
  }

  
}