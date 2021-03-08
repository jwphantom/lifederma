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

  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;
  loadingPressActive = false;

  constructor(public http: HttpClient,
    private socket: Socket,
    private storage: Storage,
    public productService: ProductService,
    private alertCtrl: AlertController,
    private gestureCtrl: GestureController,
    private authService: AuthenticationService,
    public modalController: ModalController,
    public actionSheetController: ActionSheetController) { }

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

    this.cards.changes.subscribe(() => {

      const cardArray = this.cards.toArray()

      this.useLongPress(cardArray)


    });

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



  useLongPress(cardArray) {

    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      const gesture = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: 'long-press',
        onStart: ev => {
          this.loadingPressActive = true;
        },
        onEnd: ev => {
          this.loadingPressActive = false;

          this.optionActionSheet(this.produits[i]._id, this.produits[i]);

        }

      });
      gesture.enable();

    }

  }

  async optionActionSheet(id, product) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Supprimer ' + product.code + '?',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Supprimer',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.delProduct(id);
        }
      },
      {
        text: 'Modifier',
        icon: 'create-outline',
        handler: () => {
          actionSheet.dismiss();
          this.updateProduct(id, product)
        }
      }]
    });
    await actionSheet.present();
  }



  async delProduct(id) {
    const alert = await this.alertCtrl.create({
      header: 'Suppression!',
      message: 'Voulez-vous Supprimer?',
      cssClass: 'alertLogCss',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alertDanger',
          handler: (blah) => {
          }
        }, {
          text: 'Okay',
          cssClass: 'alertDanger',
          handler: () => {
            this.productService.delProduct(id);
          }
        }
      ]
    });

    await alert.present();
  }


  async updateProduct(id, produit: Product): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Modification',
      inputs: [
        {
          type: 'text',
          name: 'name',
          placeholder: 'Nom ',
          value: produit.name
        },
        {
          type: 'text',
          name: 'code',
          placeholder: 'Nom ',
          value: produit.code
        },
        {
          type: 'text',
          name: 'price',
          placeholder: 'Nom ',
          value: produit.price
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.productService.updateProduct(id, data);
          }
        }
      ]
    });
    return await alert.present();
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


}
