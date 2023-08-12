import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TabsComponent } from './tabs/tabs.component';
import { IonicModule } from '@ionic/angular';
import { BillPreviewComponent } from './bill-preview/bill-preview.component';
import { KotPreviewComponent } from './kot-preview/kot-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [HeaderComponent,TabsComponent,BillPreviewComponent,KotPreviewComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports:[HeaderComponent,TabsComponent,BillPreviewComponent,KotPreviewComponent]
})
export class WidgetsModule { }
