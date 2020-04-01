import { Component, OnInit } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
 import { CommonService } from '../api/common.service';
import { Platform } from '@ionic/angular';



@Component({
  selector: 'app-test-download',
  templateUrl: './test-download.page.html',
  styleUrls: ['./test-download.page.scss'],
})
export class TestDownloadPage implements OnInit {

  fileurl:string;
 
  constructor(
    private file: File,
    public co : CommonService,
    private platform : Platform,
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
    }, (error) => {  
      // handle error
      console.log("ERROR",error);
    });
    console.log("Hola qleros");
  }

  playAudio(){
    this.co.showLoader();
    let url = 'http://dream-jordan.com/sites/default/files/2020-03/Citadel-es0.mp3';
    let filename = url.split("/").pop();
    this.file.readAsText (this.file.dataDirectory ,filename).then((b64str) => {
      console.log('Image B64 URL: ' + b64str);
      this.co.hideLoader();
    }).catch(err => {
      console.log('readAsDataURL failed: (' + err.code + ")" + err.message);
    });
  }


}
