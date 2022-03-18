import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListOrderPage } from './list-order.page';

const routes: Routes = [
  {
    path: '',
    component: ListOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListOrderPageRoutingModule {}
