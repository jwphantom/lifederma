import { Injectable, NgZone } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import firebase from 'firebase/app';
import 'firebase/auth';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';


@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        public ngFireAuth: AngularFireAuth,
        public ngZone: NgZone) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.ngFireAuth.authState.subscribe(user => {
                if (user) {
                    resolve(true);
                } else {
                    console.log('User is not logged in');
                    this.router.navigate(['/login']);
                    resolve(false);
                    
                }
            })
        });
    }
}