import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SLivreurPage } from './s-livreur.page';

const routes: Routes = [
  {
    path: '',
    component: SLivreurPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SLivreurPageRoutingModule {}
