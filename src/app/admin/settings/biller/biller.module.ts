import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BillerPageRoutingModule } from './biller-routing.module';

import { BillerPage } from './biller.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BillerPageRoutingModule,
    WidgetsModule
  ],
  declarations: [BillerPage]
})
export class BillerPageModule {}
