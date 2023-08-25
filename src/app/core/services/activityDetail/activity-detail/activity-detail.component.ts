import { Component, Input, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { BillActivity } from 'src/app/core/types/activity.structure';

@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.scss'],
})
export class ActivityDetailComponent  implements OnInit {
  @Input({required:true}) activity:BillActivity|undefined;
  constructor(private modalController:PopoverController) { }

  ngOnInit() {
    console.log("Received activity",this.activity);
    
  }
  close(){
    this.modalController.dismiss();
  }

}
