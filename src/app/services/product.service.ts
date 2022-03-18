import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import{ GlobalConstants } from '../common/global-constants';
import { CatProduct } from '../models/catproduct';
import { Storage } from  '@ionic/storage';


@Injectable({
  providedIn: 'root'
})

export class ProductService {
  public productsList: Product[];


  produit: Product[] = [];
  productSubject = new Subject<Product[]>();

  catproduit: CatProduct[] = [];
  catproductSubject = new Subject<CatProduct[]>();


  constructor(protected http: HttpClient,
    private socket: Socket,
    private router: Router,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    private toastCtrl: ToastController) { }


  emitProduct() {
    this.productSubject.next(this.produit);
  }

  emitCatProduct() {
    this.catproductSubject.next(this.catproduit);
  }


  async addProduct(product){

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingCtrl.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });


    this.http
      .post(`${GlobalConstants.apiURL}/product/add`, product, header)
      .subscribe(
        () => {
          this.saveProductToast();
          this.router.navigate(['/tabs/product']);
          console.log('Enregistrement terminé !');
          loading.dismiss();

        },
        (error) => {
          this.ImpossiblesaveProductToast();
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );



  }


  async getCatProduct() {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/product/cat-product/all`,header)
      .subscribe(
        (response) => {

          this.catproduit = response;
          this.emitCatProduct();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
        );      
  }

  async getProduct() {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/product/all`,header)
      .subscribe(
        (response) => {

          this.produit = response;
          this.emitProduct();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
        );      
  }

  async getProductByCat(catid) {
    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/product/category/${catid}`,header)
      .subscribe(
        (response) => {

          this.produit = response;
          this.emitProduct();

        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
        );      
  }


  async delProduct(id) {
    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .delete(`${GlobalConstants.apiURL}/product/del/${id}`, header)
      .subscribe(
        (response) => {

          this.DelProductToast();
          this.socket.emit('get-product');
          this.router.navigate(['/tabs/product']);

        },
        (error) => {
          this.ImpossibleDelProductToast();
          console.log('Erreur ! : ' + error);
        }
      );

  }

  async updateProduct(id,product) {
    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .put(`${GlobalConstants.apiURL}/product/edit/${id}`, product, header)
      .subscribe(
        (response) => {

          this.editProductToast();
          this.socket.emit('get-product');
          this.router.navigate(['/tabs/product']);

        },
        (error) => {
          this.ImpossibleeditProductToast();
          console.log('Erreur ! : ' + error);
        }
      );

  }


  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.emit('get-product');
      this.socket.on('send-product', (product) => {
        this.produit = product;
        this.emitProduct();
      });
    });
  }

  async ImpossibleDelProductToast() {
    const toast = await this.toastCtrl.create({
      message: 'Suppression Impossible',
      duration: 2000
    });
    toast.present();
  }


  async DelProductToast() {
    const toast = await this.toastCtrl.create({
      message: 'Suppression Reussi',
      duration: 2000
    });
    toast.present();
  }


  async ImpossibleeditProductToast() {
    const toast = await this.toastCtrl.create({
      message: 'Modification Impossible',
      duration: 2000
    });
    toast.present();
  }


  async editProductToast() {
    const toast = await this.toastCtrl.create({
      message: 'Modification Reussi',
      duration: 2000
    });
    toast.present();
  }

  async saveProductToast() {
    const toast = await this.toastCtrl.create({
      message: 'Produit Enregistré',
      duration: 2000
    });
    toast.present();
  }

  async ImpossiblesaveProductToast() {
    const toast = await this.toastCtrl.create({
      message: 'Enregistrement Impossible',
      duration: 2000
    });
    toast.present();
  }



}