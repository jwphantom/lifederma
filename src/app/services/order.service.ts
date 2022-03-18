import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order';
import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalConstants } from '../common/global-constants';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from './authentication-service';
import { Storage } from  '@ionic/storage';
import { Badge } from '@ionic-native/badge';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  public ordersList: Order[];


  order: Order[] = [];
  OrderSubject = new Subject<Order[]>();


  orderOne: Order[] = [];
  OrderOneSubject = new Subject<Order[]>();

  orderByCust: Order[] = [];
  orderByCustSubject = new Subject<Order[]>();

  currentDate = new Date();


  constructor(protected http: HttpClient,
    private socket: Socket,
    private router: Router,
    public storage: Storage,
    private toastCtrl: ToastController,
    private authService: AuthenticationService,
    public loadingController: LoadingController,
   ) { }


  emitOrder() {
    this.OrderSubject.next(this.order);
  }

  emitOrderOne() {
    this.OrderOneSubject.next(this.orderOne);
  }

  emitOrderByCust() {
    this.orderByCustSubject.next(this.orderByCust);
  }

  async addOrder(order, notification: boolean) {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    const user = this.authService.getUser();

    order['view'] = {
      user: user.email,
      vdate: this.currentDate
    };

    order['cdate'] = new Date().toString();



    await loading.present();
    this.http
      .post(`${GlobalConstants.apiURL}/order/add`, order,header)
      .subscribe(
        () => {
          this.saveOrderToast();
          if(notification){
            this.socket.emit('new-order', user.email);
   
            this.socket.emit('get-order');
            this.socket.emit('get-count-badge',user.email);
            this.router.navigate(['/tabs/order']);
            loading.dismiss();    
      
          }
         
          //this.badge.increase(1);

          //loading.dismiss();
        },
        (error) => {
          this.ImpossiblesaveOrderToast();
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );

  }



  async getOrder() {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/order/all`,header)
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

  async getOrderByCustOrder(phone) {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/order/byCust/${phone}`,header)
      .subscribe(
        (response) => {
          this.orderByCust = response;
          this.emitOrderByCust();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }

  async getOneOrder(id) {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/order/details/${id}`,header)
      .subscribe(
        (response) => {
          this.orderOne = response;
          this.emitOrderOne();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

  }

  async delOrder(id) {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    await loading.present();

    this.http
      .delete(`${GlobalConstants.apiURL}/order/del/${id}`, header)
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

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    await loading.present();

    this.http
      .put(`${GlobalConstants.apiURL}/order/edit/${id}`, order, header)
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

  async setViewOrder(id, email) {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    let userV = {
      user: email,
      vdate: this.currentDate
    };

    this.http
      .put(`${GlobalConstants.apiURL}/order/setView/${id}`, { email: userV }, header)
      .subscribe(
        (response) => {
          this.socket.emit('refresh-order', email);
          this.socket.emit('get-count-badge',email);
          //this.badge.decrease(1);
        },
        (error) => {
          console.log('Erreur ! : ' + error);

        }
      );
  }

  async rOder(id, data){

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });
    
    this.http
      .put(`${GlobalConstants.apiURL}/order/rOrder/${id}`, data,header)
      .subscribe(
        (response) => {
         
          this.socket.emit('get-order');
          this.router.navigate(['/tabs/order']);
          loading.dismiss();
        },
        (error) => {
          console.log('Erreur ! : ' + error);

        }
      );

  }


  async Delivered(id) {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
      duration: 2000
    });
    await loading.present();

    this.http
      .put(`${GlobalConstants.apiURL}/order/delivered/${id}`, id, header)
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

  async NotDelivered(id,data) {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
      duration: 2000
    });
    await loading.present();



    this.http
      .put(`${GlobalConstants.apiURL}/order/not-delivered/${id}`, data, header)
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
      message: 'Commande Ajoutée',
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