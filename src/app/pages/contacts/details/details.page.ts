import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/services/contact.service';
import { UpdatePage } from '../update/update.page';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements AfterViewInit {

  contactId: String;
  
  display: boolean = false;


  contactOne: Contact[] = [];

  name : string;
  phone : number;
  contactOneSubscription: Subscription;


  constructor(private route: ActivatedRoute,
    public contactService: ContactService,
    private callNumber: CallNumber,
    public modalController: ModalController) { }


  ngAfterViewInit() {
    this.contactId = this.route.snapshot.paramMap.get('id');

    this.contactService.getOneContact(this.contactId);

      this.display = true;

      this.storeOneContact();

  }


  storeOneContact() {
    this.contactOneSubscription = this.contactService.contactOneSubject.subscribe(
      (contactOne: Contact[]) => {
        this.contactOne = contactOne;
      }
    );
    this.contactService.emitOneContact();
  }

  call(phone) {
    this.callNumber.callNumber('+237' + phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }

  async UpadatecontactModal() {
    const modal = await this.modalController.create({
      component: UpdatePage,
      cssClass: 'my-custom-class',
      componentProps: {
        'name': this.contactOne['name'],
        'phone': this.contactOne['phone'],
        'id': this.contactOne['_id']
      }
    });
    return await modal.present();
  }

}
