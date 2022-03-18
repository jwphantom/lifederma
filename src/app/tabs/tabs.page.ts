import { Component, Input, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';
import { Order } from '../models/order';
import { AuthenticationService } from '../services/authentication-service';
import { OrderService } from '../services/order.service';
import { Storage } from '@ionic/storage';
import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ContactsPage } from '../pages/contacts/contacts.page';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  myMenu: any;
  menuModalDisplay: Boolean = false;
  showBackdrop = false;

  settings: CupertinoSettings = {
    onDidDismiss: (e) => {
      if (e) {
        this.showBackdrop = false;
        this.menuModalDisplay = !this.menuModalDisplay;
        this.myMenu.hide();
        this.myMenu.destroy();
      }
    }
  };



  @Input() badge: number = 0;

  orders = [];

  ordersSubscription: Subscription;

  constructor(public orderService: OrderService,
    private authService: AuthenticationService,
    private socket: Socket,
    public storage: Storage,
    public router: Router,
    public modalController: ModalController


  ) { }

  ngOnInit() {
    const user = this.authService.getUser();
    this.socket.on(`count-badge-${user.email}`, (data) => {
      //console.log(data);
      this.badge = data.cpt;
    });
  }


  async sMenuModal() {

    this.menuModalDisplay = !this.menuModalDisplay;
    this.showBackdrop = !this.showBackdrop

    if (this.menuModalDisplay || this.myMenu.isHidden()) {
      this.myMenu.present({ animate: true });
      this.myMenu.setBreakpoints({
        top: {
          enabled: false,
        },
        middle: { enabled: true, height: 300, bounce: true },
        bottom: { enabled: false, height: 0 }
      });
    } else {
      this.myMenu.hide()
    }

  }

  ionViewWillEnter() {
    this.showBackdrop = false;
    this.menuModalDisplay = false;
    this.myMenu = new CupertinoPane('.menu', this.settings);
  }

  ionViewDidLeave() {
    this.menuModalDisplay = !this.menuModalDisplay;
    this.myMenu.hide();
    this.myMenu.destroy();
  }


  routeTo(param){
    this.myMenu.hide();
    this.menuModalDisplay = !this.menuModalDisplay;
    this.showBackdrop = !this.showBackdrop;
    if(param == 'contacts'){
      this.contactModal()
    }
    if(param == 'product'){
      this.router.navigate(['/tabs/product']);

    }

  }

  async contactModal() {
    const modal = await this.modalController.create({
      component: ContactsPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
  }




}
