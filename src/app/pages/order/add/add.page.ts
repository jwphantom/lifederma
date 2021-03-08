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
import { ContactService } from 'src/app/services/contact.service';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { User } from 'src/app/models/user';


@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  data: any;

  tdate: string;

  currentDate = new Date();



  produits = [];
  productsSubscription: Subscription;


  livreur = [];
  livreursSubscription: Subscription;


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
    public orderService: OrderService,
    private datePicker: DatePicker,
    private datePipe: DatePipe,
    private contactService: ContactService,
    private storage: Storage,
    public authService : AuthenticationService) {

  }


  storeProdut() {
    this.productsSubscription = this.productService.productSubject.subscribe(
      (produits: Product[]) => {
        this.produits = produits;
      }
    );
    this.productService.emitProduct();
  }

  storeLivreur() {
    this.livreursSubscription = this.authService.livreurSubject.subscribe(
      (livreur: User[]) => {
        this.livreur = livreur;
      }
    );
    this.authService.emitLivreur();
  }

  ngOnInit() {

    this.socket.emit('get-product');
    this.socket.on('send-product', () => {
      this.productService.getProduct();
      this.storeProdut();
      this.authService.getLivreur();
      this.storeLivreur();
    });


    this.initform();

    setTimeout(() => {
      this.onAddCommande()
    }, 1000);

    this.orderForm.controls['name'].disable();




  }


  initform() {
    this.orderForm = this.formBuilder.group({
      tdate: [this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'), Validators.required],
      phone: ['', Validators.required],
      name: ['', Validators.required],
      note: [''],
      livreur: [''],
      district: ['', Validators.required],
      livraison: [500, Validators.required],
      montant: '',
      canal: ['', Validators.required],
      commande: this.formBuilder.array([])


    })
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
    
    const date_order = new Date(this.orderForm.get('tdate').value).getTime() / 1000
    const c_d = new Date(this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')).getTime() / 1000

    if (date_order < c_d) {
      this.datePassToast();
    }

    if (date_order > c_d) {
      this.orderService.addOrder(this.orderForm.value, false);
    }

    if(date_order == c_d){
      this.orderService.addOrder(this.orderForm.value, true);    
}

  }

  onAddCommande() {

    const com = this.orderForm.get('commande') as FormArray;
    com.push(this.formBuilder.group({
      qty: [1, Validators.required],
      product: [this.produits[0].price + "-" + this.produits[0].code, Validators.required]
    }));

  }

  onRemoveCommande(index: number) {
    this.getCommandeArray().removeAt(index);
  }

  onKeyUpEvent(event: any) {
    this.storage.remove('name');

    //this.contactService.getOneContact(event.target.value);
    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/contact/details/${event.target.value}`)
      .subscribe(
        (response) => {
          if (event.target.value.length == 9) {
            this.orderForm.controls['name'].enable();
            if (response != null) {
              this.storage.set('name', response['name']);

              this.storage.get('name').then((val) => {


              this.orderForm.controls['name'].setValue(val);

              });

            }
            else {
              this.orderForm.controls['name'].setValue('');
            }
          }
          else{
            this.orderForm.controls['name'].setValue('');
            this.orderForm.controls['name'].disable();

          }
        },
        (error) => {
          console.log('Erreur ! : ' + error);
          this.orderForm.controls['name'].setValue('');

        }
      );

  }

    //TOAST CONTROLLER
    async datePassToast() {
      const toast = await this.toastCtrl.create({
        message: 'Date Passé Enregistré',
        duration: 2000
      });
      toast.present();
    }

}
