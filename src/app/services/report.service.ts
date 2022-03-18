import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { Subject } from 'rxjs';
import { GlobalConstants } from '../common/global-constants';
import { Report } from '../models/report';
import { AuthenticationService } from './authentication-service';
import { OrderService } from './order.service';
import { Storage } from  '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class ReportService {

  report: Report[] = [];
  reportSubject = new Subject<Report[]>();


  constructor(
    protected http: HttpClient,
    private socket: Socket,
    public orderService: OrderService,
    private alertCtrl: AlertController,
    private authService: AuthenticationService,
    public loadingController: LoadingController,
    public router: Router,
    public storage: Storage,

  ) { }


  emitReport() {
    this.reportSubject.next(this.report);
  }


  async getReportTo_Ye(date,id){

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });
    await loading.present();

    let param =[];
    param = [date,id];
    

    
    console.log(id);

    this.http
      .post(`${GlobalConstants.apiURL}/report/generate/to_ye`, param,header)
      .subscribe(
        (response: Report[]) => {
          this.report = response;
          this.emitReport(); 
          loading.dismiss();       
        },
        (error) => {
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );
  }


  async getReportOneDate(date,id){
    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });

    await loading.present();

    let param = [date,id];

    this.http
      .post(`${GlobalConstants.apiURL}/report/generate/day`, param, header)
      .subscribe(
        (response: Report[]) => {
          this.report = response;
          this.emitReport(); 
          loading.dismiss();       
        },
        (error) => {
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );
  }


  async getReportofDates(days,id){

    let token;
    await this.storage.get('ACCESS_TOKEN').then((val) => {
      token = val;
    });

    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${token}`)
    }

    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Veuillez patienter',
    });


    await loading.present();

    let param = [days,id];

    this.http
      .post(`${GlobalConstants.apiURL}/report/generate/week`, param, header)
      .subscribe(
        (response: Report[]) => {
          this.report = response;
          this.emitReport(); 
          loading.dismiss();       
        },
        (error) => {
          console.log('Erreur ! : ' + error);
          loading.dismiss();

        }
      );
  }




}
