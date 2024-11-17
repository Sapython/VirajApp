import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TaxDetailPageRoutingModule } from './tax-detail-routing.module';

import { TaxDetailPage } from './tax-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    TaxDetailPageRoutingModule
  ],
  declarations: [TaxDetailPage]
})
export class TaxDetailPageModule {}
