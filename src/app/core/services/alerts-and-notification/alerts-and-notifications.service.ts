import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root',
})
export class AlertsAndNotificationsService {
  toastAudio = new Audio();
  toastErrorAudio = new Audio();
  playAudio(type: 'toast' | 'errorToast') {
    if (type === 'toast') {
      this.toastAudio.play();
    } else if (type === 'errorToast') {
      this.toastErrorAudio.play();
    }
  }
  async presentToast(
    message: string,
    type: 'info' | 'error' = 'info',
    duration: number = 5000,
    action: string = '',
    sound: boolean = true
  ) {
    // this.snackbar.open(message, action, { duration: duration });
    let toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
    // if (sound && type === 'info') {
    //   this.playAudio('toast');
    // } else if (sound && type === 'error') {
    //   this.playAudio('errorToast');
    // }
  }

  constructor(private toastController:ToastController) {
    // this.toastAudio.src = '/assets/audio/tones/toast.mp3';
    // this.toastAudio.volume = 0.4;
    // this.toastAudio.load();
    // this.toastErrorAudio.src = '/assets/audio/tones/error.mp3';
    // this.toastErrorAudio.volume = 0.4;
    // this.toastErrorAudio.load();
  }
}
