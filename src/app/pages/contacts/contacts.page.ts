import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController,ModalController, GestureController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/services/contact.service';
import { AddPage } from './add/add.page';
import { DetailsPageModule } from './details/details.module';
import { DetailsPage } from './details/details.page';
import { InAppBrowser , InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { PathService } from 'src/app/services/path.service';


@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements AfterViewInit {

  display: boolean = false;

  contacts: Contact[] = [];

  contactsAll: Contact[] = [];

  contactSubscription: Subscription;

  constructor(public http: HttpClient,
    private socket: Socket,
    public contactService: ContactService,
    private alertCtrl: AlertController,
    private gestureCtrl: GestureController,
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private iab : InAppBrowser,
    public path : PathService) { }


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


  ngAfterViewInit() {

    setTimeout(() => {
      this.display = true;
    
    }, 1000);

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

  async AddContactModal() {
    const modal = await this.modalController.create({
      component: AddPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async DetailContactModal(phone) {
    const modal = await this.modalController.create({
      component: DetailsPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'phone': phone,
       
      }
    });
    return await modal.present();
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }

  openUrl(url : string){
    const options : InAppBrowserOptions= {
       zoom : 'no'
    }
    const browser = this.iab.create(url, '_self', options); 
  }

}
