import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MenuPage } from './menu.page';

const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    children:[
      {
        path: '',
        redirectTo: 'categories',
        pathMatch: 'full'
      },
      {
        path: 'categories',
        loadChildren: () => import('./categories/categories.module').then( m => m.CategoriesPageModule)
      },
      {
        path: 'combos',
        loadChildren: () => import('./combos/combos.module').then( m => m.CombosPageModule)
      },
      {
        path: 'taxes',
        loadChildren: () => import('./taxes/taxes.module').then( m => m.TaxesPageModule)
      },
      {
        path: 'discount',
        loadChildren: () => import('./discount/discount.module').then( m => m.DiscountPageModule)
      },
      {
        path: 'loyalty',
        loadChildren: () => import('./loyalty/loyalty.module').then( m => m.LoyaltyPageModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuPageRoutingModule {}
