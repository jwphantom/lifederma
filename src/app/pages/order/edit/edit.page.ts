import { Directive, Component, OnInit, Input, ViewChildren, ElementRef, QueryList, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingController, AlertController, ToastController, IonCard } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { GlobalConstants } from '../../../common/global-constants';
import { Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { Product } from 'src/app/models/product';
import { OrderService } from '../../../services/order.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { DatePipe } from '@angular/common';
import { Order } from 'src/app/models/order';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements AfterViewInit {

  display: boolean = false;

  currentDate = new Date();


  tdate: string;

  orderId: String;

  produits = [];
  productsSubscription: Subscription;

  orderOne: Order[] = [];
  orderOneSubscription: Subscription;


  //Select Restore Commande
  selectRestoreDisplay: boolean = false;
  selectDisplay: boolean = true;
  commande_price: number;
  commande_code: string;


  optionSelected: string;


  public orderEditForm: FormGroup;

  @ViewChildren(IonCard, { read: ElementRef }) cards: QueryList<ElementRef>;


  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    public http: HttpClient,
    public productService: ProductService,
    private socket: Socket,
    public orderService: OrderService,
    private datePicker: DatePicker,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
  ) {

  }


  storeProduct() {
    this.productsSubscription = this.productService.productSubject.subscribe(
      (produits: Product[]) => {
        this.produits = produits;
      }
    );
    this.productService.emitProduct();
  }

  storeOneOrder() {
    this.orderOneSubscription = this.orderService.OrderOneSubject.subscribe(
      (orderOne: Order[]) => {
        this.orderOne = orderOne;
      }
    );
    this.productService.emitProduct();
  }


  ngOnInit() {

    this.orderId = this.route.snapshot.paramMap.get('id');
    console.log(this.orderId);


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

    this.orderService.getOneOrder(this.orderId);
    this.storeOneOrder();


    


  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.display = true;
      this.initform(this.orderOne);
    
        for (let t of this.orderOne['commande']) {
            this.selectRestoreDisplay = true;
            this.selectDisplay = false;
            this.commande_price = 7000;
            this.commande_code =  t.product ;
            for(let i of this.produits){
              if(i.code == t.product ){
                 this.restoreCommande(t.qty , i.price+"-"+t.product);
              }
            }   
        }
    }, 1000);

  }



  async initform(order) {
    this.orderEditForm = this.formBuilder.group({
      tdate: [order.tdate, Validators.required],
      phone: [order.phone, Validators.required],
      name: [order.name, Validators.required],
      district: [order.district, Validators.required],
      livraison: [order.livraison, Validators.required],
      montant: order.montant,
      commande: this.formBuilder.array([])


    })
  }

 

  getCommandeArray() {
    return this.orderEditForm.get('commande') as FormArray;
  }


  onSubmitForm() {
    let MLivraison: Number = 0;

    for (let control of this.getCommandeArray().controls) {

      var price = (control.get('product').value)
      var array = price.split("-", 2);

      var price = (control.get('product').value);
      price = Number((control.get('qty').value)) * Number(price.split("-", 1));
      MLivraison = MLivraison + price;

      control.get('product').setValue(array[1]);

    }

    this.orderEditForm.get('montant').setValue(MLivraison);

    this.orderService.updateOrder(this.orderId,this.orderEditForm.value);
    console.log(this.orderEditForm.value);


  }

  restoreCommande(qty, code_select) {

    const com = this.orderEditForm.get('commande') as FormArray;
    com.push(this.formBuilder.group({
      qty: [qty, Validators.required],
      product: [code_select, Validators.required]
    }));
  }


  onAddCommande() {

    const com = this.orderEditForm.get('commande') as FormArray;
    com.push(this.formBuilder.group({
      qty: [1, Validators.required],
      product: ['TVX', Validators.required]
    }));

  }

  onRemoveCommande(index: number) {
    this.getCommandeArray().removeAt(index);
  }


}
