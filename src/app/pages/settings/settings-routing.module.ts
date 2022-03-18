import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'compte',
    loadChildren: () => import('../compte/compte.module').then( m => m.ComptePageModule)
  },
  {
    path: 'notifications',
    loadChildren: () => import('../notifications/notifications.module').then( m => m.NotificationsPageModule)
  },
  {
    path: 'help',
    loadChildren: () => import('../aide/aide.module').then( m => m.AidePageModule)
  }

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule { }
