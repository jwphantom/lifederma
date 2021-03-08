import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service';
import firebase from 'firebase/app'
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userData: any;

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    private toastCtrl: ToastController,

  ) {}

  ngOnInit() {
  }

  logIn(email, password) {
    this.authService.SignIn(email.value, password.value)
      .then((res) => {
          this.router.navigate(['/tabs/order']);          
      }).catch((error) => {
        this.ImpossibleLogin(error.message)
      })
  }

  async ImpossibleLogin(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }


}
