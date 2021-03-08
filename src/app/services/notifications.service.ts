import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { Notification } from '../models/notification'
import { GlobalConstants } from '../common/global-constants';


@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  notification: Notification[] = [];
  NotificationSubject = new Subject<Notification[]>();


  constructor(protected http: HttpClient,
    private socket: Socket,
    private router: Router,
    private toastCtrl: ToastController,
    public loadingController: LoadingController) { }


  emitNotification() {
    this.NotificationSubject.next(this.notification);
  }

  async enableNotification(value,id) {
    this.socket.emit('enable-notification',value,id);
  }



}
