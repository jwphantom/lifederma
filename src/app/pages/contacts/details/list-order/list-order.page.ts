import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order';
import { OrderService } from 'src/app/services/order.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.page.html',
  styleUrls: ['./list-order.page.scss'],
})
export class ListOrderPage implements OnInit {

  @Input() name: string;
  @Input() phone: string;


  orders = [];
  orderSubscription: Subscription;
  currentDate = new Date();


  constructor(
    public modalCtrl: ModalController,
    public oService: OrderService,
    public orderService: OrderService,
    private alertCtrl: AlertController,
    private datePipe: DatePipe,
    private toastCtrl: ToastController,


  ) { }

  ngOnInit() {
    this.storeOrder();
  }

  ionViewWillEnter() {
    this.storeOrder();

  }

  storeOrder() {
    this.oService.getOrderByCustOrder(this.phone);
    this.orderSubscription = this.oService.orderByCustSubject.subscribe(
      (order: Order[]) => {
        this.orders = order;
      }
    );
    this.oService.emitOrderByCust();
  }


  dismiss() {

    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  async repeatOrder(order): Promise<void> {

    let repOrder = order;
    const alert = await this.alertCtrl.create({
      header: 'Repéter la commande',
      inputs: [
        {
          type: 'date',
          name: 'tdate',
          min: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
          placeholder: '',
          value: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {

            const date_order = new Date(data.tdate).getTime() / 1000
            const c_d = new Date(this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')).getTime() / 1000

            repOrder.tdate = data.tdate;

            if (date_order < c_d) {
              this.datePassToast();
            }

            if (date_order > c_d) {
              this.orderService.addOrder(repOrder, false);
              this.modalCtrl.dismiss({
              });
            }

            if (date_order == c_d) {
              this.orderService.addOrder(repOrder, true);
              this.modalCtrl.dismiss({
              });

            }


          }
        }
      ]
    });
    return await alert.present();
  }

  //TOAST CONTROLLER
  async datePassToast() {
    const toast = await this.toastCtrl.create({
      message: 'Date Passé Enregistré',
      duration: 2000
    });
    toast.present();
  }

}
