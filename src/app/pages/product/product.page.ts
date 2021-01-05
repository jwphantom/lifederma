import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { ProductService } from '../../services/product.service';
import { Product } from 'src/app/models/product';
import { Subscription } from 'rxjs';
import { AlertController, ActionSheetController, IonCard } from '@ionic/angular';
import { Gesture, GestureController } from '@ionic/angular';


@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements AfterViewInit {


  data: any;

  produits = [];

  prod: Product[] = [];
  productsSubscription: Subscription;

  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;
  loadingPressActive = false;

  constructor(public http: HttpClient,
    private socket: Socket,
    public productService: ProductService,
    private alertCtrl: AlertController,
    private gestureCtrl: GestureController,
    public actionSheetController: ActionSheetController) { }

  ngOnInit() {

    this.socket.emit('get-product');
    this.socket.on('send-product', () => {
      this.productService.getProduct()

      this.productsSubscription = this.productService.productSubject.subscribe(
        (produits: Product[]) => {
          this.produits = produits;

        }
      );
      this.productService.emitProduct();


    });

  }

  ngAfterViewInit() {

    this.cards.changes.subscribe(() => {

      const cardArray = this.cards.toArray()

      this.useLongPress(cardArray)


    });

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

          this.optionActionSheet(this.produits[i]._id,this.produits[i]);

        }

      });
      gesture.enable();

    }

  }

  async optionActionSheet(id,product) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Supprimer '+ product.code +'?',
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



}
