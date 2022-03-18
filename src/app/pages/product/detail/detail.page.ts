import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ProductService } from '../../../services/product.service';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { AlertController, ActionSheetController, IonCard, ModalController } from '@ionic/angular';
import { Gesture, GestureController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { Observable } from 'rxjs';
import { CatProduct } from 'src/app/models/catproduct';
import { GlobalConstants } from 'src/app/common/global-constants';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements AfterViewInit {

  devise: string = GlobalConstants.devise;

  
  display: boolean = false;


  @Input() cat: string;
  @Input() catId: string;



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
    public modalCtrl: ModalController,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {
    this.produits = [];

  }


  ionViewWillEnter() {
    this.storeProduct();
  }

  storeProduct() {
    this.productService.getProductByCat(this.catId);

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

    setTimeout(() => {
      this.display = true;
    
    }, 1000);

    this.cards.changes.subscribe(() => {

      const cardArray = this.cards.toArray()

      this.useLongPress(cardArray)


    });

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

  

  dismissModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

}
