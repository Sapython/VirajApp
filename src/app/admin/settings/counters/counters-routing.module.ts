import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CountersPage } from './counters.page';

const routes: Routes = [
  {
    path: '',
    component: CountersPage
  },
  {
    path: 'edit/:methodId',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CountersPageRoutingModule {}
