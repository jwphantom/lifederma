import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication-service';


@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.page.html',
  styleUrls: ['./recovery.page.scss'],
})
export class RecoveryPage implements OnInit {

  isclickLogin : boolean = false;

  recoveryForm : FormGroup;
  email : string;


  constructor(private formBuilder : FormBuilder,
    private authService : AuthenticationService,
    private toastCtrl : ToastController,
    private router : Router) { }

  ngOnInit() {
    this.initRecoveryForm();
  }

  initRecoveryForm(){
    this.recoveryForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.maxLength(70), Validators.pattern('^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'), Validators.required])]
    })
  }

  submitForm(){
    this.isclickLogin = !this.isclickLogin; 


    this.authService.recoverPassword(this.recoveryForm.get('email').value)
    .then((res) => {
      this.ToastMessage(res)
      this.isclickLogin = !this.isclickLogin; 
      this.router.navigate(['/login']);         


    }).catch((error) => {
      this.isclickLogin = !this.isclickLogin; 
      this.ToastMessage(error.message)

    })

  }

  async ToastMessage(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


}


