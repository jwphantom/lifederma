import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { GlobalConstants } from 'src/app/common/global-constants';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  public contactForm : FormGroup;

  

  constructor(public modalCtrl: ModalController,
              public formBuilder: FormBuilder,
              public contactService: ContactService,
              public http : HttpClient,
              private socket: Socket,
              private toastCtrl: ToastController,
              private router: Router,


    ) { }
    

  ngOnInit() {
    this.initform();
  }

  dismiss() {
    
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  initform(){
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
    })
  }

  onSubmitcontact(){
   
    this.http
      .post(`${GlobalConstants.apiURL}/contact/add`, this.contactForm.value)
      .subscribe(
        () => {
          this.saveContactToast();
          this.socket.emit('get-contact');
          this.dismiss()        
        },
        (error) => {
          this.ImpossibleSaveContactToast();
          console.log('Erreur ! : ' + error);
        }
      );
  }

  async saveContactToast() {
    const toast = await this.toastCtrl.create({
      message: 'Contact Enregistré',
      duration: 2000
    });
    toast.present();
  }

  async ImpossibleSaveContactToast() {
    const toast = await this.toastCtrl.create({
      message: 'Enregistrement Impossible',
      duration: 2000
    });
    toast.present();
  }




}
