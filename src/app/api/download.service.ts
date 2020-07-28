import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
 import { CommonService } from '../api/common.service';
import { Platform } from '@ionic/angular';
import { StorageService } from '../storage.service';
import {TourService} from '../api/tour.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(private file: File,
    public co : CommonService,
    private platform : Platform,
    private tour:TourService,
    public storage: StorageService,
    public transfer: FileTransfer) { 

    }

    downloadAudio(audio: any, tour:any, pais:number){
      this.co.showLoader();
      let url = this.co.API + audio.field_media_audio_file;
      let filename = url.split("/").pop();
      let path = null;
      if(this.platform.is('ios')){
        path = this.file.documentsDirectory;
      }else{
        path = this.file.dataDirectory;
      }
      let targetPath = path + filename;
      console.log("targetPath",targetPath);
      this.fileTransfer.download(url, targetPath).then((entry) => {
        this.co.hideLoader();
        console.log('download complete: ' + entry.toURL());
        this.co.presentToast("Descarga completada");
        let keyTour = String(tour.nid);      
        //store tour info
        this.storage.setObject(keyTour,{
          nid:tour.nid,
          type:"tour",
          name:tour.title,
          title:tour.title,//para el detalle del tour
          field_costo:tour.field_costo,//para el detalle del tour
          tid:pais,
          body:tour.body,
          tour:tour.nid,
          field_dream_jordan:tour.field_dream_jordan
        });
        //store audio info
        let keyAudio = String(audio.mid);
        this.storage.setObject(keyAudio,{
          nid:audio.mid,
          type:"audio",
          name:audio.name,
          tour:tour.nid,
          pais:pais,
          field_media_audio_file:entry.toURL(),
          plays:0,
          progress:0
        });
      }, (error) => {  
        // handle error
        this.co.hideLoader();
        console.log("ERROR",error);
        this.co.presentToast("ERROR "+error);
      });
    }
}
