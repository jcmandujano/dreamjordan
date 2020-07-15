import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController, NavController, LoadingController, ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router: Router, 
              public alertController: AlertController, 
              public modalController: ModalController, 
              public navCtrl: NavController,
              public loadingCtrl: LoadingController,
              public toastController: ToastController) { }

  API: string = 'https://dream-jordan.com/';
  PRIMARY_DOMAIN: string = 'https://dream-jordan.com';
  loader: any = null;

  goToHome(){
    this.router.navigateByUrl("/inicio");
  }

  go(route:string) {
    this.router.navigateByUrl(route);
  }
  setRoot(route:string){
    this.navCtrl.navigateRoot(route);
  }
  async presentAlert(HEADER,SUBHEADER,MESSAGE) {
    const alert = await this.alertController.create({
      header: HEADER,
      subHeader: SUBHEADER,
      message: MESSAGE,
      buttons: ['Aceptar'],
      backdropDismiss: false
    });

    await alert.present();
  }

 

  async showLoader(){
    console.log('calling showloader',this.loader);
    if(this.loader == null){
      this.loader = await this.loadingCtrl.create({
        spinner: 'crescent'
      });
      await this.loader.present();
    }
  }

  hideLoader(){
    console.log('calling hide loader',this.loader);
    if(this.loader != null){
      console.log('liader is not null');
      this.loader.dismiss();
      this.loader = null;
    }
  }

  async presentToast(message:string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    await toast.present();
  }

}