import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Contact } from '../models/contact';
import { GlobalConstants } from '../common/global-constants';
import { Subject } from 'rxjs';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';



@Injectable({
  providedIn: 'root'
})
export class ContactService {

  contact: Contact[] = [];
  ContactSubject = new Subject<Contact[]>();

  contactOne: Contact[] = [];
  contactOneSubject = new Subject<Contact[]>();

  constructor(protected http: HttpClient,
    private socket: Socket,
    private router: Router,
    private toastCtrl: ToastController,
    public loadingController: LoadingController,
    private callNumber: CallNumber,
    private storage: Storage,
    public modalCtrl: ModalController,) { }

  emitContact() {
    this.ContactSubject.next(this.contact);
  }

  emitOneContact() {
    this.contactOneSubject.next(this.contactOne);
  }



  async getcontact() {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/contact/all`, header)
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

  async getOneContact(id) {
    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/contact/details/${id}`,header)
      .subscribe(
        (response) => {
          this.contactOne = response;
          this.emitOneContact();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

  async updateContact(id, contact){

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }


    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    await loading.present();
   
      this.http
        .put(`${GlobalConstants.apiURL}/contact/edit/${id}`, contact,header)
        .subscribe(
          () => {
            this.updateContactToast();
            this.socket.emit('get-contact');
            loading.dismiss();
            this.dismissModal();    
          },
          (error) => {
            this.ImpossibleUpdateContactToast();
            console.log('Erreur ! : ' + error);
            loading.dismiss();

          }
        );

  }

  async updateContactToast() {
    const toast = await this.toastCtrl.create({
      message: 'Contact Modifié',
      duration: 2000
    });
    toast.present();
  }

  async ImpossibleUpdateContactToast() {
    const toast = await this.toastCtrl.create({
      message: 'Impossible de Modifier',
      duration: 2000
    });
    toast.present();
  }

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

 
}
