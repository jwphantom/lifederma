import { Component, OnInit, ElementRef, ViewChild, ViewChildren, AfterViewInit, AfterViewChecked, QueryList, NgZone } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Order } from 'src/app/models/order';
import { OrderService } from '../../services/order.service';

import { Subscription } from 'rxjs';
import { AlertController, IonCard, Gesture, GestureController, ActionSheetController, } from '@ionic/angular';
import { Router } from '@angular/router';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { element } from 'protractor';


@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements AfterViewInit {


  orders = [];

  ordersSubscription: Subscription;

  segmentModel = "unCompleted";

  @ViewChildren("cardUncompleted", { read: ElementRef }) cards: QueryList<ElementRef>;
  loadingPressActive = false;


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
  ) { }

  ngOnInit() {
    this.socket.emit('get-order');
    this.socket.on('send-order', () => {
      this.orderService.getOrder()

      this.ordersSubscription = this.orderService.OrderSubject.subscribe(
        (orders: Order[]) => {
          this.orders = orders;
        }
      );
      this.orderService.emitOrder();

    });

    this.socket.on('send-notification-order', () => {
      // Schedule a single notification
      this.localNotifications.schedule({
        id: 1,
        text: 'Nouvelle Commande',
        sound: 'file://sound.mp3',
        data: { secret: 'key_data' }
      });

    })


  }


  ngAfterViewInit() {

    this.cards.changes.subscribe(() => {

      const cardArray = this.cards.toArray()

      var order = this.orders;
      var uncompleted_order =  order.filter(element => element.delivered == undefined);
      this.useLongPress(cardArray, uncompleted_order)



    });

  }

  useLongPress(cardArray, uncompleted_order) {

    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      console.log(card.nativeElement);

      const agesture = this.gestureCrtl.create({
        el: card.nativeElement,
        gestureName: 'long-press',
        onStart: ev => {
          this.loadingPressActive = true;
          console.log('rrr');
        },
        onEnd: ev => {
          this.loadingPressActive = false;

          this.optionActionSheet(uncompleted_order[i]._id);

        }

      });
      agesture.enable(true);

    }

  }

  async optionActionSheet(id) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Que souhaitez-vous effectuer?',
      cssClass: 'my-custom-class',
      buttons: [{
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


  segmentChanged(ev: any) { }



}
