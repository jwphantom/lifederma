import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SLivreurPageRoutingModule } from './s-livreur-routing.module';

import { SLivreurPage } from './s-livreur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SLivreurPageRoutingModule
  ],
  declarations: [SLivreurPage]
})
export class SLivreurPageModule {}
