import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActivityPageRoutingModule } from './activity-routing.module';

import { ActivityPage } from './activity.page';
import { CustomerPage } from './customer/customer.page';
import { SalesPage } from './sales/sales.page';
import { TablePage } from './table/table.page';
import { SwiperModule } from 'swiper/angular';
import { WidgetsModule } from 'src/app/widgets/widgets.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActivityPageRoutingModule,
    SwiperModule,
    WidgetsModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule
  ],
  declarations: [ActivityPage,CustomerPage,SalesPage,TablePage]
})
export class ActivityPageModule {}
