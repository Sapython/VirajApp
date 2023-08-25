import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { TabsComponent } from './tabs/tabs.component';
import { IonicModule } from '@ionic/angular';
import { BillPreviewComponent } from './bill-preview/bill-preview.component';
import { KotPreviewComponent } from './kot-preview/kot-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BottomTabsComponent } from './bottom-tabs/bottom-tabs.component';



@NgModule({
  declarations: [HeaderComponent,TabsComponent,BillPreviewComponent,KotPreviewComponent,BottomTabsComponent],
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    ReactiveFormsModule
  ],
  exports:[HeaderComponent,TabsComponent,BillPreviewComponent,KotPreviewComponent,BottomTabsComponent]
})
export class WidgetsModule { }
