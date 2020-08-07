import { NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHandler, HTTP_INTERCEPTORS} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { InterceptorService } from './api/interceptor.service';
import { Network } from "@ionic-native/network/ngx";
//import { Braintree } from '@ionic-native/braintree/ngx'; //ios only
//import { PayPal } from '@ionic-native/paypal/ngx';//paypal ios only
import {InAppPurchase} from '@ionic-native/in-app-purchase';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [ BrowserModule, 
    HttpClientModule, 
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    IonicModule.forRoot({
    mode:'ios',
  }), AppRoutingModule],
  providers: [
    StatusBar,
    HttpClient,
    NativeStorage,
    SplashScreen,
    InAppPurchase,
    //Braintree, //ios only
   // PayPal,
    File,
    FileTransfer,
    Network,
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

