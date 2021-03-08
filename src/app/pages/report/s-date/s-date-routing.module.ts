import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SDatePage } from './s-date.page';

const routes: Routes = [
  {
    path: '',
    component: SDatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SDatePageRoutingModule {}
