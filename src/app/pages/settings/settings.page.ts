import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { ProfileService } from '../../services/profile.service'
import { Storage } from '@ionic/storage';
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Observable } from 'rxjs';
import { InAppBrowser , InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { PathService } from 'src/app/services/path.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  appname: string = GlobalConstants.appname;


  constructor(public authService: AuthenticationService,
    public profileService: ProfileService,
    private alertCtrl: AlertController,
    private storage: Storage,
    public router: Router,
    private socket: Socket,
    private iab: InAppBrowser,
    public path : PathService) { }

  user: any = [];

  c_user: any = [];



  ngOnInit() {
    console.log(this.path.previousPath)
  }
  

  ionViewWillEnter() {
    const user = this.authService.getUser();

    if (user) {
      this.socket.emit('user-profile', user.email);
      this.getUserProfile(user.email).subscribe(user => {
        this.c_user = [];
        //console.log(user);
        this.c_user.push(user['user']);
        this.user = user['user'];

      });
    }

  }

  async updateName(): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: 'Votre Nom',
      inputs: [
        {
          type: 'text',
          name: 'fullName',
          placeholder: 'Votre Nom  Complet',
          value: this.user.name
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updateName(data.fullName, this.user._id, this.user.email);
          }
        }
      ]
    });
    return await alert.present();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }

  getUserProfile(email) {
    let observable = new Observable(observer => {
      this.socket.on(`get-user-profile-${email}`, (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  openUrl(url : string){
    const options : InAppBrowserOptions= {
       zoom : 'no'
    }
    const browser = this.iab.create(url, '_self', options); 
  }




}
