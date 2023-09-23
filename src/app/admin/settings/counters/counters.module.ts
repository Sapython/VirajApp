import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CountersPageRoutingModule } from './counters-routing.module';

import { CountersPage } from './counters.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CountersPageRoutingModule,
    WidgetsModule
  ],
  declarations: [CountersPage]
})
export class CountersPageModule {}
