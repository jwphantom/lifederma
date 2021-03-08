import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController,ModalController, GestureController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/services/contact.service';
import { AddPage } from './add/add.page';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  contacts: Contact[] = [];

  contactsAll: Contact[] = [];

  contactSubscription: Subscription;

  constructor(public http: HttpClient,
    private socket: Socket,
    public contactService: ContactService,
    private alertCtrl: AlertController,
    private gestureCtrl: GestureController,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController) { }


  ngOnInit() {

    this.socket.emit('get-contact');
    this.socket.on('send-contact', () => {
      this.contactService.getcontact();

      this.contactSubscription = this.contactService.ContactSubject.subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
          this.contactsAll = contacts;
        }
      );
      this.contactService.emitContact();

    });

  }


  onSearchTerm(ev: CustomEvent) {

    this.contacts = this.contactsAll;

    const val = ev.detail.value;
  
    if (val && val.trim() !== '') {
      this.contacts = this.contacts.filter(term => {
        return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    }
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

}
