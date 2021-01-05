import { Directive, Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Socket } from 'ngx-socket-io';
import { GlobalConstants } from '../../../common/global-constants';
import { Subject, Subscription } from 'rxjs';
import { ProductService } from '../../../services/product.service';
import { Product } from 'src/app/models/product';
import { OrderService } from '../../../services/order.service';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { asEnumerable } from 'linq-es2015';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  data: any;

  tdate:string;

  currentDate = new Date();



  produits = [];
  productsSubscription: Subscription;


  public orderForm: FormGroup;


  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    public http: HttpClient,
    public productService: ProductService,
    private socket: Socket,
    public orderService : OrderService,
    private datePicker: DatePicker,
    private datePipe: DatePipe) { 

    }


  storeProdut() {
    this.productsSubscription = this.productService.productSubject.subscribe(
      (produits: Product[]) => {
        this.produits = produits;
      }
    );
    this.productService.emitProduct();
  }

  ngOnInit() {

    this.socket.emit('get-product');
    this.socket.on('send-product', () => {
      this.productService.getProduct()

      this.storeProdut()


    });

   

    this.initform();

    setTimeout(() => {
        this.onAddCommande()
    }, 1000);


 
  }


  initform() {
    this.orderForm = this.formBuilder.group({
      tdate: [this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'), Validators.required],
      phone: ['', Validators.required],
      name: ['', Validators.required],
      district: ['', Validators.required],
      livraison: [500, Validators.required],
      montant: '',
      commande: this.formBuilder.array([])


    })
  }

  showDatepicker(){
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK,
      okText:"Save Date",
      todayText:"Set Today"
    }).then(
      date => {
        this.tdate = date.getDate()+"/"+date.toLocaleString('default', { month: 'long' })+"/"+date.getFullYear();
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }


  getCommandeArray() {
    return this.orderForm.get('commande') as FormArray;
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
    
    this.orderForm.get('montant').setValue(MLivraison);

    //var data = this.orderForm.get('description').value;

    //this.orderForm.get('commande').setValue(this.groupProductOrder(data));

    //delete this.orderForm.value.description;

    
    this.orderService.addOrder(this.orderForm.value);
    console.log(this.orderForm.value);


  }

  // groupProductOrder(data) {
  
  //   // var linq = Enumerable.asEnumerable(data);
  //   // var result =
  //   //   linq.GroupBy(function (x) { return x.product })
  //   //     .Select(function (x) { return {qty: x.Sum(function (y) { return y.qty | 0; }), product: x.Key() }; })
  //   //     .ToArray();
  //   // //console.log(result);

  //   // return result;


  // }

  onAddCommande() {

    const com = this.orderForm.get('commande') as FormArray;
    com.push(this.formBuilder.group({
      qty: [1, Validators.required],
      product: [this.produits[0].price+"-"+this.produits[0].code, Validators.required]
    }));

  }

  onRemoveCommande(index: number) {
    this.getCommandeArray().removeAt(index);
  }



}
