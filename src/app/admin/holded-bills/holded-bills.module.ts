import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HoldedBillsPageRoutingModule } from './holded-bills-routing.module';

import { HoldedBillsPage } from './holded-bills.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HoldedBillsPageRoutingModule
  ],
  declarations: [HoldedBillsPage]
})
export class HoldedBillsPageModule {}
