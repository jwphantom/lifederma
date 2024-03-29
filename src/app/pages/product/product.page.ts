import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { AlertController, ActionSheetController, IonCard, ModalController } from '@ionic/angular';
import { Gesture, GestureController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { Observable } from 'rxjs';
import { CatProduct } from 'src/app/models/catproduct';
import { DetailPage } from './detail/detail.page';
import { InAppBrowser , InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { PathService } from 'src/app/services/path.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements AfterViewInit {

  user: any = [];

  data: any;

  produits = [];

  prod: Product[] = [];
  productsSubscription: Subscription;

  category: CatProduct[] = [];
  catproductsSubscription: Subscription;


  addOrderAccess: Boolean = false

  c_user: any = [];


  constructor(public http: HttpClient,
    private socket: Socket,
    private storage: Storage,
    public productService: ProductService,
    private alertCtrl: AlertController,
    private gestureCtrl: GestureController,
    private authService: AuthenticationService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController,
    private iab: InAppBrowser,
    public path : PathService) { }

  ngOnInit() {

    // //this.socket.emit('get-product');
    // this.socket.on('send-product', () => {
    //   this.storeProduct();
    // });

  }

  ionViewWillEnter() {
    //this.storeProduct();
    this.storeCatProduct();
    this.grantAccess()
  }

  storeCatProduct() {
    this.productService.getCatProduct()

    this.catproductsSubscription = this.productService.catproductSubject.subscribe(
      (cat: CatProduct[]) => {
        this.category = cat;

      }
    );
    this.productService.emitCatProduct();
  }

  storeProduct() {
    this.productService.getProduct()

    this.productsSubscription = this.productService.productSubject.subscribe(
      (produits: Product[]) => {
        this.produits = produits;

      }
    );
    this.productService.emitProduct();

    this.storage.get('current-user').then((val) => {
      this.user = val;
    });

  }

 

  ngAfterViewInit() {

  }

  grantAccess() {

    const user = this.authService.getUser();
    if (user) {
      this.socket.emit('user-profile', user.email);
      this.getUserProfile(user.email).subscribe(user => {
        this.c_user = [];
        this.c_user.push(user['user']);
        if(user['user'].function == "Distribution"){
          this.addOrderAccess = false;
        }
        if(user['user'].function == "CEO"){
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



  async ListProduct(cat, catId) {
    const modal = await this.modalController.create({
      component: DetailPage,
      cssClass: 'my-custom-class',
      componentProps: {
        'cat': cat,
        'catId': catId
        
      }
    });
    return await modal.present();
  }


  openUrl(url : string){
    const options : InAppBrowserOptions= {
       zoom : 'no'
    }
    const browser = this.iab.create(url, '_self', options); 
  }

  
}
