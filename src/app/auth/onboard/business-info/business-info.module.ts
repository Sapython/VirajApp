import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusinessInfoPageRoutingModule } from './business-info-routing.module';

import { BusinessInfoPage } from './business-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BusinessInfoPageRoutingModule
  ],
  declarations: [BusinessInfoPage]
})
export class BusinessInfoPageModule {}
