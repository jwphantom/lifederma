import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, GestureController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {

  contacts: Contact[] = [];
  contactSubscription: Subscription;

  constructor(public http: HttpClient,
    private socket: Socket,
    public contactService: ContactService,
    private alertCtrl: AlertController,
    private gestureCtrl: GestureController,
    public actionSheetController: ActionSheetController) { }


  ngOnInit() {

    this.socket.emit('get-contact');
    this.socket.on('send-contact', () => {
      this.contactService.getcontact();

      this.contactSubscription = this.contactService.ContactSubject.subscribe(
        (contacts: Contact[]) => {
          this.contacts = contacts;
        }
      );
      this.contactService.emitContact();

    });

  }

}
