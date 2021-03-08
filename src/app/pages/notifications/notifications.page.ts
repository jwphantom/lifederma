import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NotificationsService } from 'src/app/services/notifications.service';
import { Storage } from '@ionic/storage';
import { Socket } from 'ngx-socket-io';
import { ProfileService } from 'src/app/services/profile.service';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication-service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  enable : Boolean = false;

  c_user: any = [];

  notification = {};

  constructor(
    private socket: Socket,
    private storage: Storage,
    private alertCtrl: AlertController,
    public notificationService : NotificationsService,
    public profileService : ProfileService,
    private authService : AuthenticationService

  ) { }

  ngOnInit() {

    const user = this.authService.getUser();

    if(user)
    {
      this.socket.emit('user-profile',user.email);
      this.getUserProfile(user.email).subscribe(user => {
        this.c_user = [];
        if(!user['user'].notification[0]){
          this.setTrueDefaultNotification(user['user']._id);
        }
        this.c_user.push(user['user']);
      });
    }

  }

  getUserProfile(email) {
    let observable = new Observable(observer => {
      this.socket.on(`get-user-profile-${email}`, (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  setTrueDefaultNotification(id) {

    this.notification = 
      {
        notification : {
          display : true,
          son : 'file://sound.mp3',
        }
      }

    this.notificationService.enableNotification(this.notification,id);

  }

  enableNotification($event) {

    this.notification = 
      {
        notification : {
          display : !this.c_user[0].notification[0].display,
          son : 'file://sound.mp3',
        }
      }

    this.notificationService.enableNotification(this.notification,this.c_user[0]._id);

  }

}
