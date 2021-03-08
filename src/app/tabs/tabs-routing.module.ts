import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../services/authguard';
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
                loadChildren: '../pages/order/order.module#OrderPageModule',
                

              }
            ],canActivate: [AuthGuard]
        },
        {
          path: 'product',
          children:
            [
              {
                path: '',
                loadChildren: '../pages/product/product.module#ProductPageModule'
              }
            ],canActivate: [AuthGuard],
        },
        {
          path: 'report',
          children:
            [
              {
                path: '',
                loadChildren: '../pages/report/report.module#ReportPageModule'
              }
            ],canActivate: [AuthGuard],
        },
        {
          path: 'settings',
          children:
            [
              {
                path: '',
                loadChildren: '../pages/settings/settings.module#SettingsPageModule'
              }
            ],canActivate: [AuthGuard],
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