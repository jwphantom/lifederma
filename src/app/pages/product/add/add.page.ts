import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ProductService } from '../../../services/product.service';
import { Socket } from 'ngx-socket-io';
import{ GlobalConstants } from '../../../common/global-constants';
import { Subscription } from 'rxjs';
import { CatProduct } from 'src/app/models/catproduct';



@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  public productForm : FormGroup;

  category = [];
  categorySubscription: Subscription;


  constructor(
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController,
    public http : HttpClient,
    public productService : ProductService,
    private socket: Socket)  
    { }
    
    storeCategory() {
      this.categorySubscription = this.productService.catproductSubject.subscribe(
        (category: CatProduct[]) => {
          this.category = category;
        }
      );
      this.productService.emitCatProduct();
    }


  ngOnInit() {
    this.initform();
  }

  ionViewWillEnter() {
    this.storeCategory();
  }

  initform(){
    this.productForm = this.formBuilder.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],


    })
  }

  getDescriptionArray() {
    return this.productForm.get('description') as FormArray;
  }

  onSubmitForm(){
   
    this.http
      .post(`${GlobalConstants.apiURL}/product/add`, this.productForm.value)
      .subscribe(
        () => {
          this.saveProductToast();
          //this.socket.emit('get-product');
          this.router.navigate(['/tabs/product']);
          console.log('Enregistrement terminé !');
        },
        (error) => {
          this.ImpossiblesaveProductToast();
          console.log('Erreur ! : ' + error);
        }
      );
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
