import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { ScrollVanishDirective } from '../../directives/scroll-vanish.directive';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScrollHideDirective } from 'src/app/directives/scroll-hide.directive';
import { ScrollHideBDirective } from 'src/app/directives/scroll-hide-b.directive';
import { SuperTabsModule } from '@ionic-super-tabs/angular';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule,
    SuperTabsModule,
  ],
  
  declarations: [OrderPage,ScrollVanishDirective,ScrollHideDirective,ScrollHideBDirective],
})
export class OrderPageModule {

  
}
