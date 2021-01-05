import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SettingsPage } from './settings.page';

const routes: Routes = [
  {
    path: '',
    component: SettingsPage
  },
  {
    path: 'contacts',
    loadChildren: () => import('../contacts/contacts.module').then( m => m.ContactsPageModule)
  }

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SettingsPageRoutingModule { }
