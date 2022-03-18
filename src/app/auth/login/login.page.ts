import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication-service';
import firebase from 'firebase/app'
import { ToastController } from '@ionic/angular';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { GlobalConstants } from '../../common/global-constants';
import { LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userData: any;

  authPage : Boolean = false;

  isclickLogin : boolean = false;

  //Global Constant
  appname: string = GlobalConstants.appname;



  constructor(
    public authService: AuthenticationService,
    public router: Router,
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    public loadingController: LoadingController

  ) { }

  ngOnInit() {
  }

  logIn(email, password) {
    //this.presentLoading();
    this.isclickLogin = !this.isclickLogin; 
    this.authService.SignIn(email.value, password.value)
      .then((res) => {
        this.isclickLogin = !this.isclickLogin; 

        this.authService.StoreToken();
      }).catch((error) => {
        this.isclickLogin = !this.isclickLogin; 
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

  async auth(){

    this.authPage = !this.authPage

  }

  async close(){
    this.authPage = !this.authPage
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'veuillez patienter',
      duration: 2000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
    console.log('Loading dismissed!');
  }



}
