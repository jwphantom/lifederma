import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Socket } from 'ngx-socket-io';
import { Network } from '@ionic-native/network/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private socket: Socket,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications,
    private network: Network,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.localNotifications.clearAll();

      this.backgroundMode.on('activate').subscribe(s => {
        console.log('backgroud active');
        this.socket.on('send-notification-order', () => {
          // Schedule a single notification
          this.localNotifications.schedule({
            id: 1,
            text: 'Nouvelle Commande',
            sound: 'file://sound.mp3',
          });

        })
      });
      this.backgroundMode.enable();


    });
  }
}
