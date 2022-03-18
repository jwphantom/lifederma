import { Injectable } from '@angular/core';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AuthenticationService } from './authentication-service';
import { Observable } from 'rxjs';

import 'firebase/auth';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../common/global-constants';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import firebase from 'firebase/app'


@Injectable({
    providedIn: 'root'
})
export class ProfileService {
    private userProfile: AngularFirestoreDocument<User>;
    constructor(
        private firestore: AngularFirestore,
        private authService: AuthenticationService,
        protected http: HttpClient,
        private storage: Storage,
        private socket: Socket,
        private router: Router,
    ) { }
    currentUser: any = [];

    async getUserProfile() {

        let token;
        await this.storage.get('ACCESS_TOKEN').then((val) => {
            token = val;
        });

        var header = {
            headers: new HttpHeaders()
                .set('Authorization', `Basic ${token}`)
        }

        const user = await this.authService.getUser();

        if (user) {
            this.http
                .get<any[]>(`${GlobalConstants.apiURL}/user/details/${user.email}`, header)
                .subscribe(
                    (response) => {
                        this.socket.emit('get-user');
                        this.storage.set('current-user', response);
                    },
                    (error) => {
                        console.log('Erreur ! : ' + error);
                    }
                );
        }

    }

    async updateName(fullName: string, id: String, email: String) {
        let token;
        await this.storage.get('ACCESS_TOKEN').then((val) => {
            token = val;
        });

        var header = {
            headers: new HttpHeaders()
                .set('Authorization', `Basic ${token}`)
        }

        var name = {
            name: fullName
        };

        this.http
            .put(`${GlobalConstants.apiURL}/user/updateName/${id}`, name,header)
            .subscribe(
                (response) => {
                    this.socket.emit('user-profile', email);
                    this.router.navigate(['/tabs/settings']);
                },
                (error) => {
                    console.log('Erreur ! : ' + error);

                }
            );
    }

    async updatePhone(phone: string, id: String, email: String) {
        let token;
        await this.storage.get('ACCESS_TOKEN').then((val) => {
            token = val;
        });

        var header = {
            headers: new HttpHeaders()
                .set('Authorization', `Basic ${token}`)
        }

        var tel = { phone: phone };

        this.http
            .put(`${GlobalConstants.apiURL}/user/updatePhone/${id}`, tel, header)
            .subscribe(
                (response) => {
                    this.socket.emit('user-profile', email);
                    this.router.navigate(['/tabs/settings/compte']);
                },
                (error) => {
                    console.log('Erreur ! : ' + error);

                }
            );
    }

    async getUser() {
        const user: firebase.User = await this.authService.getUser();
        this.currentUser = user;
    }

    async updatePassword(
        newPassword: string,
        oldPassword: string
    ): Promise<void> {

        const user: firebase.User = await this.authService.getUser();
        this.currentUser = user;

        const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
            this.currentUser.email,
            oldPassword
        );
        try {
            await this.currentUser.reauthenticateWithCredential(credential);
            return this.currentUser.updatePassword(newPassword);
        } catch (error) {
            console.error(error);
        }
    }
}