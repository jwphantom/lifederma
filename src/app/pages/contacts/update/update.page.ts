import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  @Input() name: string;
  @Input() phone: string;
  @Input() id: string;


  public contactForm : FormGroup;

  
  constructor(public modalCtrl: ModalController,
    public formBuilder: FormBuilder,
    public contactService: ContactService,
    private socket: Socket,
    private toastCtrl: ToastController,
    private router: Router,


) { }


  ngOnInit() {

    this.initform();

  }

  initform(){
    this.contactForm = this.formBuilder.group({
      name: [this.name, Validators.required],
      phone: [this.phone, Validators.required],
    })
  }


  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'dismissed': true
    });
  }

  onSubmitcontact(){
    this.contactService.updateContact(this.id,this.contactForm.value);
    this.router.navigate(['/tabs/settings/contacts']);
  }


}
