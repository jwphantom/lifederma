import { Identifiers } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { EmailJSResponseStatus } from 'emailjs-com';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication-service';

@Component({
  selector: 'app-s-livreur',
  templateUrl: './s-livreur.page.html',
  styleUrls: ['./s-livreur.page.scss'],
})
export class SLivreurPage implements OnInit {

  livreur = [];

  livreurAll = [];

  @Input() id: string;



  livreursSubscription: Subscription;


  constructor(public modalCtrl: ModalController,
    public authService : AuthenticationService) { }

  ngOnInit() {
    this.authService.getLivreur();
    this.storeLivreur();
  }

  onSearchTerm(ev: CustomEvent) {

    this.livreur = this.livreurAll;

    const val = ev.detail.value;
  
    if (val && val.trim() !== '') {
      this.livreur = this.livreur.filter(term => {
        return term.name.toLowerCase().indexOf(val.trim().toLowerCase()) > -1;
      });
    }
  }

  storeLivreur() {
    this.livreursSubscription = this.authService.livreurSubject.subscribe(
      (livreur: User[]) => {
        this.livreurAll = livreur;
        this.livreur = livreur;
      }
    );
    this.authService.emitLivreur();
  }
  
  
  dismissSDate(id,nom) {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalCtrl.dismiss({
      'id': id,
      'nom': nom
    });
  }

  radioLivreur(id,nom) {
    if(!nom || !id ){
      this.dismissSDate('all','Tous');

    }else{
      this.dismissSDate(id,nom);
    }
  }




}
