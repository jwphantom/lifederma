import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Contact } from '../models/contact';
import { GlobalConstants } from '../common/global-constants';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contact: Contact[] = [];
  ContactSubject = new Subject<Contact[]>();

  constructor(protected http: HttpClient,
    private socket: Socket,
    private router: Router,
    private toastCtrl: ToastController,
    public loadingController: LoadingController) { }

  emitContact() {
    this.ContactSubject.next(this.contact);
  }

  getcontact() {
    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/contact/all`)
      .subscribe(
        (response) => {

          this.contact = response;
          this.emitContact();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }


}
