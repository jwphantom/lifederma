import { NgModule } from '@angular/core';
import {HidenavModule} from 'ionic4-hidenav';

@NgModule({
    imports: [HidenavModule],
    exports: [HidenavModule]
})
export class SharedModule { }