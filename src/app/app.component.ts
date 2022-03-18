import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Socket } from 'ngx-socket-io';
import { Network } from '@ionic-native/network/ngx';
import { AuthenticationService } from './services/authentication-service';
import { Observable } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  c_user: any = [];


  constructor(
    private socket: Socket,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundMode: BackgroundMode,
    private localNotifications: LocalNotifications,
    private network: Network,
    private authService: AuthenticationService,
    private overlayContainer: OverlayContainer
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.localNotifications.clearAll();

      this.backgroundMode.setDefaults({ silent: true });

      this.backgroundMode.on('activate').subscribe(s => {

        console.log('backgroud active');

        this.sendNotification();

      });
      this.backgroundMode.enable();
    });
  }


  sendNotification() {
    const user = this.authService.getUser();

    if (user) {
      this.socket.emit('user-profile', user.email);
      this.getUserProfile(user.email).subscribe(user => {
        this.c_user = [];
        this.c_user = (user['user']);
      });
    }
    this.socket.on('send-notification', email => {
      console.log(user.email)
      if (email['email'] == user.email) {
        console.log("pas de notification");
      }
      else {
        console.log(true);
        if (this.c_user.notification[0].display == true) {
          this.localNotifications.schedule({
            id: 1,
            text: 'Nouvelle Commande',
            sound: 'file://sound.mp3',
          });
        }
      }
    });

  }


  getProfile(email) {
    let observable = new Observable(observer => {
      this.socket.on(`get-profile-${email}`, (data) => {
        observer.next(data);
      });
    })
    return observable;
  }



  getUserProfile(email) {
    let observable = new Observable(observer => {
      this.socket.on(`get-user-profile-${email}`, (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

}
