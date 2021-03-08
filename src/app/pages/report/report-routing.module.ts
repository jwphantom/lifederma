import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportPage } from './report.page';

const routes: Routes = [
  {
    path: '',
    component: ReportPage
  },
  {
    path: 's-date',
    loadChildren: () => import('./s-date/s-date.module').then( m => m.SDatePageModule)
  },
  {
    path: 's-livreur',
    loadChildren: () => import('./s-livreur/s-livreur.module').then( m => m.SLivreurPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportPageRoutingModule {}
