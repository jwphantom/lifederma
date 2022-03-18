import { Injectable, NgZone } from '@angular/core';
import firebase from 'firebase/app'
import { User } from "../models/user";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../common/global-constants';
import { LoadingController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';
import { Storage } from  '@ionic/storage';


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  userData: any;


  livreur: User[] = [];
  livreurSubject = new Subject<User[]>();

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    protected http: HttpClient,
    private toastCtrl: ToastController,
    public storage: Storage,
    public loadingController: LoadingController
  ) {
    this.ngFireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    })
  }

  getUser() {
    return firebase.auth().currentUser;
  }

  // Login in with email/password
  SignIn(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }

  async StoreToken() {
    this.http
      .post<any[]>(`${GlobalConstants.apiURL}/user/login`, { email: this.getUser().email })
      .subscribe(
        async (res) => {
          await this.storage.set("ACCESS_TOKEN", res['token']);
          await this.storage.set("userId", res['userId']);
          this.router.navigate(['/tabs/order']);         
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }



  // Register user with email/password
  async RegisterUser(email) {
    var user = {
      email: email,
      function: 'Distribution',
      notification: {
        display: true,
        son: 'file://sound.mp3',
      }
    };

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    await loading.present();

    this.http
      .post(`${GlobalConstants.apiURL}/user/register`, user)
      .subscribe(
        (response) => {

          var templateParams = {
            email: email,
            password: response['cred']
          };

          emailjs.send('service_6x8boil', 'template_30m3s4f', templateParams, 'user_3UNPpOCkDvySRx4kLn1Lk')
            .then(function (response) {

              console.log('SUCCESS!', response.status, response.text);
            }, function (err) {
              console.log('FAILED...', err);
            });


          this.SaveUser();
          this.router.navigate(['/login']);
          loading.dismiss();

          console.log();

        },
        (error) => {
          this.UnsaveUser();
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );

  }

  emitLivreur() {
    this.livreurSubject.next(this.livreur);
  }

  async getLivreur() {

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    this.http
      .get<any[]>(`${GlobalConstants.apiURL}/user/livreur`, header)
      .subscribe(
        (response) => {
          this.livreur = response;
          this.emitLivreur();
        },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );
  }


  async SaveUser() {
    const toast = await this.toastCtrl.create({
      message: 'Inscription Terminé',
      duration: 2000
    });
    toast.present();
  }

  async UnsaveUser() {
    const toast = await this.toastCtrl.create({
      message: 'Inscription Impossible',
      duration: 2000
    });
    toast.present();
  }



  // Email verification when new user register
  SendVerificationMail() {
    return firebase.auth().currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email']);
      })
  }

  // Recover password
  PasswordRecover(passwordResetEmail) {
    return firebase.auth().sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email has been sent, please check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Returns true when user's email is verified
  get isEmailVerified(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user.emailVerified !== false) ? true : false;
  }

  // Sign in with Gmail
  GoogleAuth() {
    return this.AuthLogin(new firebase.auth.GoogleAuthProvider());
  }

  // Auth providers
  AuthLogin(provider) {
    return firebase.auth().signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['/tabs/order']);
        })
        this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error)
      })
  }

  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      phone: user.phone,
      function: user.function,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    })
  }

  // Sign-out 
  logout() {
    // firebase.auth().signOut().then(() => {
    //   this.router.navigate(['/login']);
    // }).catch((error) => {
    //   console.log(error)
    // });

    return firebase.auth().signOut().then(() => {
      localStorage.removeItem('user');
      localStorage.removeItem('current-user');
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('userId');

      this.router.navigate(['/login']);
    })
  }


  async recoverPassword(email : string){

    return firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        return('Password reset email has been sent, please check your inbox.');
      }).catch((error) => {
        return(error)
      })

  }

}