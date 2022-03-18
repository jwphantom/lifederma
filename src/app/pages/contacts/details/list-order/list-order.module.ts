import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListOrderPageRoutingModule } from './list-order-routing.module';

import { ListOrderPage } from './list-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListOrderPageRoutingModule
  ],
  declarations: [ListOrderPage]
})
export class ListOrderPageModule {}
