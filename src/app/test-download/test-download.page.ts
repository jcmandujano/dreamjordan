import { Component, OnInit } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
 import { CommonService } from '../api/common.service';
import { Platform } from '@ionic/angular';
import { StorageService } from '../storage.service';



@Component({
  selector: 'app-test-download',
  templateUrl: './test-download.page.html',
  styleUrls: ['./test-download.page.scss'],
})
export class TestDownloadPage implements OnInit {

  fileurl:string;
  path = "";
  constructor(
    private file: File,
    public co : CommonService,
    private platform : Platform,
    public storage: StorageService,
    public transfer: FileTransfer) { }
    fileTransfer: FileTransferObject = this.transfer.create();
  ngOnInit() {
  }


  saveAudio(){
    this.co.showLoader();
    let url = 'http://dream-jordan.com/sites/default/files/2020-03/Citadel-es0.mp3';
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
      this.storage.setObject('mediadata',{
        nid:0,
        url:entry.toURL()
      });
    }, (error) => {  
      // handle error
      this.co.hideLoader();
      console.log("ERROR",error);
    });
    console.log("Hola qleros");
  }

  playAudio(){
    let win: any = window;
    let safeURL = win.Ionic.WebView.convertFileSrc(this.file.dataDirectory+'data/yourFile.png');
     this.storage.getObject("mediadata").then(data => {
      console.log("DATOS", data.url);
      this.path = win.Ionic.WebView.convertFileSrc(data.url);
     });
    
    /*this.co.showLoader();
    let url = 'http://dream-jordan.com/sites/default/files/2020-03/Citadel-es0.mp3';
    let filename = url.split("/").pop();
    this.file.readAsText (this.file.dataDirectory ,filename).then((b64str) => {
      console.log('Image B64 URL: ' + b64str);
      this.co.hideLoader();
    }).catch(err => {
      console.log('readAsDataURL failed: (' + err.code + ")" + err.message);
    });*/
  }


}
