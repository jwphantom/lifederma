import { NgModule } from '@angular/core';
import { BrowserModule, HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { GlobalConstants } from './common/global-constants';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { DatePipe } from '@angular/common';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';

//import { IonicGestureConfig } from './utils/IonicGestureConfig'
import { Network } from '@ionic-native/network/ngx';

import  * as Hammer from 'hammerjs';

export class  customHammerConfig extends HammerGestureConfig{
  overrides = {
    'press': {
      direction : Hammer.DIRECTION_ALL
    }
  }
}

const config: SocketIoConfig = { url: "https://server-scare.herokuapp.com", options: {} };

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    SocketIoModule.forRoot(config),
    AppRoutingModule],
  providers: [
    StatusBar,
    SplashScreen,
    BackgroundMode,
    DatePipe,
    DatePicker,
    Network,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: customHammerConfig
    },
    LocalNotifications,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
