import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
 import { CommonService } from '../api/common.service';
import { Platform } from '@ionic/angular';
import { StorageService } from '../storage.service';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  fileTransfer: FileTransferObject = this.transfer.create();

  constructor(private file: File,
    public co : CommonService,
    private platform : Platform,
    public storage: StorageService,
    public transfer: FileTransfer) { 

    }

    downloadAudio(object: any){
      let obj = object;
      this.co.showLoader();
      let url = this.co.API + obj.field_media_audio_file;
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
        let name = String(obj.nid);
        console.log("name",name);
        this.storage.setObject(name,{
          nid:obj.nid,
          name:obj.name,
          url:entry.toURL(),
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
