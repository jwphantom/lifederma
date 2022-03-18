
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Contact } from 'src/app/models/contact';
import { ContactService } from 'src/app/services/contact.service';
import { UpdatePage } from '../update/update.page';
import { SMS } from '@ionic-native/sms/ngx';
import { ListOrderPage } from './list-order/list-order.page';
import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from 'src/app/common/global-constants';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  contactId: String;

  display: boolean = false;

  contactOne: Contact[] = [];

  name: string;

  @Input() phone: string;

  contactOneSubscription: Subscription;

  builkSmsPane: any;

  builkSmsDisplay: Boolean = false;
  showBackdrop = false;

  maxlength = 0;
  sendBuilkActive = false;
  messageRelance =
    `Sassaye!\nDu 21 au 23 dec acheter votre the minceur express ventre plat et corps au prix exceptionnel de 5.000F et 7.000F.\ncontact: https://wa.me/237657591738`;



  settings: CupertinoSettings = {
    onDidDismiss: (e) => {
      if (e) {
        this.showBackdrop = false;
        this.builkSmsDisplay = !this.builkSmsDisplay;
        this.builkSmsPane.hide();
        this.builkSmsPane.destroy();
      }
    }
  };



  constructor(private route: ActivatedRoute,
    public contactService: ContactService,
    private callNumber: CallNumber,
    private sms: SMS,
    public modalController: ModalController,
    public storage: Storage,
    public loadingController: LoadingController,
    private router: Router,
    private toastCtrl: ToastController,
    protected http: HttpClient

  ) { }

  ngOnInit() {
    this.contactOne = [];

  }

  ionViewWillEnter() {

    this.maxlength = this.messageRelance.length;

    //this.contactId = this.route.snapshot.paramMap.get('id');

    this.contactService.getOneContact(this.phone);

    this.display = true;

    this.storeOneContact();

    this.showBackdrop = false;
    this.builkSmsDisplay = false;
    this.builkSmsPane = new CupertinoPane('.builkSmsPane', this.settings);

  }

  ionViewWillLeave() {
    this.contactOne = [];
    this.builkSmsDisplay = !this.builkSmsDisplay;
    this.builkSmsPane.hide();
    this.builkSmsPane.destroy();

  }

  ngAfterViewInit() {
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

  SMS(phone) {
    this.sms.send('+237' + phone, 'Salut Service Client ')
      .then(res => console.log('SM dialer!', res))
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

  async listOrderCustModal(name) {
    const modal = await this.modalController.create({
      component: ListOrderPage,
      componentProps: {
        'name': this.contactOne['name'],
        'phone': this.contactOne['phone']

      },
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }


  async builkSmsPanel() {

    this.builkSmsDisplay = !this.builkSmsDisplay;
    this.showBackdrop = !this.showBackdrop

    if (this.builkSmsDisplay || this.builkSmsPane.isHidden()) {
      this.builkSmsPane.present({ animate: true });
      this.builkSmsPane.setBreakpoints({
        top: {
          enabled: false,
        },
        middle: { enabled: true, height: 400, bounce: true },
        bottom: { enabled: false, height: 0 }
      });
    } else {
      this.builkSmsPane.hide()
    }

  }

  writeBuilkSms(ev: CustomEvent) {

    this.maxlength = ev.detail.value.length;

    const val = ev.detail.value.length;
    this.messageRelance = ev.detail.value;

    console.log(val);

    if (val > 158) {
      this.sendBuilkActive = true;
    }
    else {
      this.sendBuilkActive = false;
    }
  }

  async sendMessage() {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization', `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    await loading.present();

    this.http
      .post(`${GlobalConstants.apiURL}/builkSms/relance-client/${this.contactOne['phone']}`, { msg: this.messageRelance }, header)
      .subscribe(
        (response) => {
          this.showBackdrop = false;
          this.builkSmsDisplay = !this.builkSmsDisplay;
          this.builkSmsPane.hide();
          this.builkSmsPane.destroy();
          loading.dismiss();
          this.statutSendToast("Message En cours d'envoie");


        },
        (error) => {
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );


    console.log(this.messageRelance);
  }

  async statutSendToast(msg) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();

  }


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }


}
