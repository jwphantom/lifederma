import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children:
      [
        {
          path: 'order',
          children:
            [
              {
                path: '',
                loadChildren: '../pages/order/order.module#OrderPageModule'
              }
            ]
        },
        {
          path: 'product',
          children:
            [
              {
                path: '',
                loadChildren: '../pages/product/product.module#ProductPageModule'
              }
            ]
        },
        {
          path: 'settings',
          children:
            [
              {
                path: '',
                loadChildren: '../pages/settings/settings.module#SettingsPageModule'
              }
            ]
        },
        {
          path: '',
          redirectTo: '/tabs/order',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: '/tabs/order',
    pathMatch: 'full'
  }
];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class TabsPageRoutingModule {}