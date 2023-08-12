import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BusinessPageRoutingModule } from './business-routing.module';

import { BusinessPage } from './business.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    BusinessPageRoutingModule,
    WidgetsModule
  ],
  declarations: [BusinessPage]
})
export class BusinessPageModule {}
