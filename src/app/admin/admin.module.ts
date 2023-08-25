import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminPageRoutingModule } from './admin-routing.module';

import { AdminPage } from './admin.page';
import { WidgetsModule } from '../widgets/widgets.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WidgetsModule,
    AdminPageRoutingModule,
  ],
  declarations: [AdminPage]
})
export class AdminPageModule {}
