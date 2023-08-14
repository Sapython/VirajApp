import { Injectable } from '@angular/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';
import { AlertsAndNotificationsService } from './alerts-and-notification/alerts-and-notifications.service';
@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  constructor(private alertify:AlertsAndNotificationsService) { }

  async saveAndOpenFile(base64Data:string, fileName:string, extension:string, mimeType:string){
    try{
      // make fileName path safe
      fileName = fileName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      // Write the file to the data directory
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data
      });
      console.log("savedFile.uri",savedFile.uri);
      // Open the file using the device default app
      await FileOpener.open({
        filePath: savedFile.uri,
        contentType: mimeType
      })
    } catch (e) {
      this.alertify.presentToast("Cannot download file: "+e,"error");
    }
  }
}
