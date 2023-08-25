import { Injectable } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { BillActivity } from '../../types/activity.structure';

@Injectable({
  providedIn: 'root'
})
export class ActivityDetailService {

  constructor(private modalController:PopoverController) { }

  async openDetail(activity:BillActivity) {
    console.log("activity",activity);
    const popover = await this.modalController.create({
      component: ActivityDetailComponent,
      componentProps:{
        activity:activity
      },
      cssClass:'activity-detail'
    });
    console.log("popover",popover);
    return await popover.present();
  }
}
