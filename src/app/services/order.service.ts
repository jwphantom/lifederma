import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalConstants } from '../common/global-constants';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
  public ordersList: Order[];


  order: Order[] = [];
  OrderSubject = new Subject<Order[]>();


  orderOne: Order[] = [];
  OrderOneSubject = new Subject<Order[]>();


  constructor(protected http: HttpClient,
    private socket: Socket,
    private router: Router,
    private toastCtrl: ToastController,
    public loadingController: LoadingController) { }


  emitOrder() {
    this.OrderSubject.next(this.order);
  }

  emitOrderOne() {
    this.OrderOneSubject.next(this.orderOne);
  }

  async addOrder(order) {

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    await loading.present();
    this.http
      .post(`${GlobalConstants.apiURL}/order/add`, order)
      .subscribe(
        () => {
          this.saveOrderToast();
          this.socket.emit('new-order');
          this.socket.emit('get-order');
          this.router.navigate(['/tabs/order']);
          loading.dismiss();
        },
        (error) => {
          this.ImpossiblesaveOrderToast();
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );

  }


  getOrder() {
    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/order/all`)
      .subscribe(
        (response) => {

          this.order = response;
          this.emitOrder();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );


  }

  getOneOrder(id) {

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/order/details/${id}`)
      .subscribe(
        (response) => {
          this.orderOne = response;
          this.emitOrderOne();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

    //console.log(this.orderOne);


  }

  async delOrder(id) {

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    await loading.present();

    this.http
      .delete(`${GlobalConstants.apiURL}/order/del/${id}`)
      .subscribe(
        (response) => {

          this.DelOrderToast();
          this.socket.emit('get-order');
          this.router.navigate(['/tabs/order']);

          loading.dismiss();

        },
        (error) => {
          this.ImpossibleDelOrderToast();
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );

  }

  async updateOrder(id, order) {

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    await loading.present();

    this.http
      .put(`${GlobalConstants.apiURL}/order/edit/${id}`, order)
      .subscribe(
        (response) => {
          this.editOrderToast();
          this.socket.emit('get-order');
          this.router.navigate(['/tabs/order']);
          loading.dismiss();
        },
        (error) => {
          this.ImpossibleeditOrderToast();
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );

  }

  async Delivered(id) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
      duration: 2000
    });
    await loading.present();

    this.http
      .put(`${GlobalConstants.apiURL}/order/delivered/${id}`,id)
      .subscribe(
        (response) => {

          this.delivredOrderToast();
          this.socket.emit('get-order');
          this.router.navigate(['/tabs/order']);
          loading.dismiss();

        },
        (error) => {
          this.ImpossibledelivredOrderToast();
          console.log('Erreur ! : ' + error);
          loading.dismiss();
        }
      );

  }

  async NotDelivered(id) {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
      duration: 2000
    });
    await loading.present();

    this.http
      .put(`${GlobalConstants.apiURL}/order/not-delivered/${id}`,id)
      .subscribe(
        (response) => {

          this.NotdelivredOrderToast();
          this.socket.emit('get-order');
          this.router.navigate(['/tabs/order']);
          loading.dismiss()

        },
        (error) => {
          this.ImpossibleNotdelivredOrderToast();
          console.log('Erreur ! : ' + error);
          loading.dismiss();
        }
      );

  }



  //TOAST CONTROLLER
  async saveOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Produit Enregistré',
      duration: 2000
    });
    toast.present();
  }

  async ImpossiblesaveOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Enregistrement Impossible',
      duration: 2000
    });
    toast.present();
  }

  async ImpossibleDelOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Suppression Impossible',
      duration: 2000
    });
    toast.present();
  }


  async DelOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Suppression Reussi',
      duration: 2000
    });
    toast.present();
  }


  async ImpossibleeditOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Modification Impossible',
      duration: 2000
    });
    toast.present();
  }


  async editOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Modification Reussi',
      duration: 2000
    });
    toast.present();
  }

  async delivredOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Commande terminé',
      duration: 2000
    });
    toast.present();
  }

  async ImpossibledelivredOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Impossible de terminer',
      duration: 2000
    });
    toast.present();
  }

  async NotdelivredOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Commande Annulée',
      duration: 2000
    });
    toast.present();
  }

  async ImpossibleNotdelivredOrderToast() {
    const toast = await this.toastCtrl.create({
      message: 'Impossible d\'Annuler',
      duration: 2000
    });
    toast.present();
  }


}