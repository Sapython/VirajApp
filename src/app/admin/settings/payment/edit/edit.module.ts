import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditPageRoutingModule } from './edit-routing.module';

import { EditPage } from './edit.page';
import { WidgetsModule } from 'src/app/widgets/widgets.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    WidgetsModule,
    EditPageRoutingModule
  ],
  declarations: [EditPage]
})
export class EditPageModule {}
