import { Component, OnInit, ElementRef, ViewChild, ViewChildren, AfterViewInit, AfterViewChecked, QueryList, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Order } from 'src/app/models/order';
import { OrderService } from '../../services/order.service';

import { Subscription } from 'rxjs';
import { AlertController, IonCard, Gesture, GestureController, ActionSheetController, } from '@ionic/angular';
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { element } from 'protractor';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements AfterViewInit {

  timer = 0;
  preventSimpleClick = false;

  user: any = [];

  c_user: any = [];

  addOrderAccess: Boolean = false;



  orders = [];

  ordersSubscription: Subscription;

  segmentModel = "unCompleted";



  @ViewChildren("cardUncompleted", { read: ElementRef }) cards: QueryList<ElementRef>;
  loadingPressActive = false;


  viewOrder: boolean = false;

  el: ElementRef;




  constructor(
    private socket: Socket,
    public orderService: OrderService,
    private alertCtrl: AlertController,
    public router: Router,
    private localNotifications: LocalNotifications,
    private _el: ElementRef,
    public _zone: NgZone,
    private gestureCrtl: GestureController,
    public actionSheetController: ActionSheetController,
    private callNumber: CallNumber,
    private storage: Storage,
    private elementRef: ElementRef,
    private authService: AuthenticationService,

  ) { }

  ngOnInit() {

    const user = this.authService.getUser();

    this.socket.on('send-order', () => {
      this.storeOrder();
    });

    this.socket.on(`refresh-order-${user.email}`, () => {
      this.storeOrder();
    });

    this.sendNotification();


    if (user) {
      this.socket.emit('user-profile', user.email);
      this.getUserProfile(user.email).subscribe(user => {
        this.c_user = [];
        //console.log(user);
        this.user = (user['user']);
      });
    }


  }

  ionViewWillEnter() {
    this.storeOrder();
    this.grantAccess()

  }

  storeOrder() {
    this.orderService.getOrder()
    const user = this.authService.getUser();

    this.ordersSubscription = this.orderService.OrderSubject.subscribe(
      (orders: Order[]) => {
        this.orders = orders;
      }
    );
    this.orderService.emitOrder();

  }

  grantAccess() {

    const user = this.authService.getUser();
    if (user) {
      this.socket.emit('user-profile', user.email);
      this.getUserProfile(user.email).subscribe(user => {
        this.c_user = [];
        this.c_user.push(user['user']);
        this.user = user['user'];
        if (user['user'].function == "Distribution") {
          this.addOrderAccess = false;
        }
        if (user['user'].function == "CEO") {
          this.addOrderAccess = true;
        }
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

  getProfile(email) {
    let observable = new Observable(observer => {
      this.socket.on(`get-profile-${email}`, (data) => {
        observer.next(data);
      });
    })
    return observable;
  }


  sendNotification() {
    const user = this.authService.getUser();
    //this.socket.emit('new-order');
    this.socket.on('send-notification', email => {
      console.log(user.email)
      if (email['email'] == user.email) {
        console.log("pas de notification");
      }
      else {
        if (this.user.notification[0].display == true) {
          this.localNotifications.schedule({
            id: 1,
            text: 'Nouvelle Commande',
            sound: 'file://sound.mp3',
          });
        }
      }
    });

  }

  ngAfterViewInit() {

    this.cards.changes.subscribe(() => {

      const cardArray = this.cards.toArray()

      var order = this.orders;

      var uncompleted_order = order.filter(element => element.delivered == undefined);
      this.useLongPress(cardArray, uncompleted_order)

    });

  }

  useLongPress(cardArray, uncompleted_order) {

    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      //console.log(card.nativeElement);

      const gesture = this.gestureCrtl.create({
        el: card.nativeElement,
        gestureName: 'long-press',
        onStart: ev => {
          this.loadingPressActive = true;
        },
        onEnd: ev => {
          this.loadingPressActive = false;

          if (this.user.function == "CEO") {
            this.orderMasterActionSheet(uncompleted_order[i]._id, uncompleted_order[i].phone);
          }
          if (this.user.function == "Distribution") {
            this.orderDistributionActionSheet(uncompleted_order[i]._id, uncompleted_order[i].phone);
          }
          if (this.user.function == "CM") {
            this.orderCMActionSheet(uncompleted_order[i]._id, uncompleted_order[i].phone);
          }



        }

      });
      gesture.enable();

    }

  }
  s

  async orderMasterActionSheet(id, phone) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Que souhaitez-vous effectuer?',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Appeler ' + phone + '?',
          icon: 'call-outline',
          handler: () => {
            this.call(phone)
          }
        },
        {
          text: 'Supprimer',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.delOrder(id);
          }
        },
        {
          text: 'Modifier',
          icon: 'create-outline',
          handler: () => {
            actionSheet.dismiss();
            this.updateOrder(id)
          },

        },
        {
          text: 'Statut',
          icon: 'alert-circle-outline',
          handler: () => {
            actionSheet.dismiss();
            this.delivered(id)
          },

        }
      ]
    });
    await actionSheet.present();
  }

  async orderDistributionActionSheet(id, phone) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Que souhaitez-vous effectuer?',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Appeler ' + phone + '?',
          icon: 'call-outline',
          handler: () => {
            this.call(phone)
          }
        },
        {
          text: 'Statut',
          icon: 'alert-circle-outline',
          handler: () => {
            actionSheet.dismiss();
            this.delivered(id)
          },

        }
      ]
    });
    await actionSheet.present();
  }

  async orderCMActionSheet(id, phone) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Que souhaitez-vous effectuer?',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Appeler ' + phone + '?',
          icon: 'call-outline',
          handler: () => {
            this.call(phone)
          }
        },
        {
          text: 'Modifier',
          icon: 'create-outline',
          handler: () => {
            actionSheet.dismiss();
            this.updateOrder(id)
          },

        }
      ]
    });
    await actionSheet.present();
  }





  async delOrder(id) {
    const alert = await this.alertCtrl.create({
      header: 'Suppression!',
      message: 'Voulez-vous Supprimer?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alertDanger',
          handler: (blah) => {
            console.log('Confirm Cancel: Annulé');
          }
        }, {
          text: 'Okay',
          cssClass: 'alertDanger',
          handler: () => {
            this.orderService.delOrder(id);
          }
        }
      ]
    });

    await alert.present();
  }

  updateOrder(order: Order) {
    this.router.navigate(['/tabs/order/edit', order]);
  }

  async delivered(id) {

    const alert = await this.alertCtrl.create({
      header: 'Statut de la Commande!',
      message: 'Commande Livrée?',
      buttons: [
        {
          text: 'Oui',
          handler: () => {
            this.orderService.Delivered(id);
          }
        },
        {
          text: 'Non',
          handler: () => {
            this.orderService.NotDelivered(id);
          }
        },
        {
          text: 'Retour',
          role: 'cancel',
          cssClass: 'alertDanger',
          handler: (blah) => {
            console.log('Confirm Cancel: Annulé');
          }
        }
      ]
    });

    await alert.present();

  }

  doRefresh() {
    document.location.reload();
  }


  call(phone) {
    this.callNumber.callNumber('+237' + phone, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
  }


  segmentChanged(ev: any) { }



  setView(id) {
    this.orderService.setViewOrder(id, this.user.email)
  }

  getStatutView(view) {
    for (let i = 0; i < view.length; i++) {
      if (view[i] == this.user.email) {
        return true;
      }
    }


  }



}
