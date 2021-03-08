import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { ProfileService } from 'src/app/services/profile.service';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-compte',
  templateUrl: './compte.page.html',
  styleUrls: ['./compte.page.scss'],
})
export class ComptePage implements OnInit {

  user: any = [];


  constructor(public authService: AuthenticationService,
    public profileService: ProfileService,
    private alertCtrl: AlertController,
    private storage: Storage,
    private socket: Socket,) { }

  ngOnInit() {
    this.storage.get('current-user').then((val) => {
      this.user = val;
    });
  }

  ionViewWillEnter() {
    const user = this.authService.getUser();

    if (user) {
      this.socket.emit('user-profile', user.email);
      this.getUserProfile(user.email).subscribe(user => {
       
        this.user = user['user'];

      });
    }

  }



  async updatePhone(): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: 'Votre Numéro',
      inputs: [
        {
          type: 'tel',
          name: 'phone',
          placeholder: '657591738',
          value: this.user.phone
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updatePhone(data.phone, this.user._id, this.user.email);
          }
        }
      ]
    });
    return await alert.present();
  }

  async updatePassword(): Promise<void> {
    const alert = await this.alertCtrl.create({
      subHeader: 'Changer Mot de Passe',
      inputs: [
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' },
        { name: 'newPassword', placeholder: 'New password', type: 'password' }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileService.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          }
        }
      ]
    });
    return await alert.present();
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
