import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SDatePageRoutingModule } from './s-date-routing.module';

import { SDatePage } from './s-date.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SDatePageRoutingModule
  ],
  declarations: [SDatePage]
})
export class SDatePageModule {}
