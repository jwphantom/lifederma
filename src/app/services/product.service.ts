import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { Socket } from 'ngx-socket-io';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import{ GlobalConstants } from '../common/global-constants';
import { CatProduct } from '../models/catproduct';


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
    private toastCtrl: ToastController) { }


  emitProduct() {
    this.productSubject.next(this.produit);
  }

  emitCatProduct() {
    this.catproductSubject.next(this.catproduit);
  }

  getCatProduct() {
    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/cat-product/all`)
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

  getProduct() {
    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/product/all`)
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

  getProductByCat(catid) {
    console.log(catid);
    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/product/category/${catid}`)
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


  delProduct(id) {

    this.http
      .delete(`${GlobalConstants.apiURL}/product/del/${id}`)
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

  updateProduct(id,product) {

    this.http
      .put(`${GlobalConstants.apiURL}/product/edit/${id}`, product)
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



}