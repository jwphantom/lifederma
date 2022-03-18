import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { SDatePage } from './s-date/s-date.page';
import { CupertinoPane, CupertinoSettings } from 'cupertino-pane';
import { DatePipe } from '@angular/common';
import { ReportService } from 'src/app/services/report.service';
import { Observable, Subscription } from 'rxjs';
import { Report } from 'src/app/models/report';
import { GlobalConstants } from '../../common/global-constants';
import { DatePicker } from '@ionic-native/date-picker/ngx';
import { FormGroup, FormControl } from '@angular/forms';
import { SLivreurPage } from './s-livreur/s-livreur.page';
import { AuthenticationService } from 'src/app/services/authentication-service';
import { Socket } from 'ngx-socket-io';

import { LoadingController } from '@ionic/angular';
import * as jspdf from 'jspdf';
import domtoimage from 'dom-to-image';
import { File, IWriteOptions } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';


@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  c_user: any = [];

  user: any = [];

  addOrderAccess: Boolean = false;

  myPane: any;

  sDatePane: any;

  currentDate = new Date();

  nLivreur = "Tous";
  nId = "All";


  range = new FormGroup({
    start: new FormControl(this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')),
    end: new FormControl(this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'))
  });


  //Global Constant
  appname: string = GlobalConstants.appname;
  localisation: string = GlobalConstants.localisation;
  devise: string = GlobalConstants.devise;


  dateModalDisplay: Boolean = false;
  sdateModalDisplay: Boolean = false;
  showBackdrop = false;
  DisplayReport = false

  sDateRadio = 'today';

  sDateFrench = "Aujourd'hui"


  reports = [];

  rSubscription: Subscription;



  //today
  today = new Date();

  //yesterday
  yesterday = new Date().setDate(new Date().getDate() - 1);

  week = [this.getMondayWeek(), this.getSundayWeek()];


  month = [new Date(this.today.getFullYear(), this.today.getMonth(), 1), new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0)]

  getMondayWeek() {

    const date = new Date();
    var day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
  }

  getSundayWeek() {
    const date = new Date();
    return new Date(date.setDate(date.getDate() + (7 - date.getDay()) === 7 ? 0 : (7 - date.getDay())));

  }

  storeDayOfCWeek() {
    let allDayWeek = [];
    for (let i = 0; i <= 6; i++) {
      allDayWeek.push(new Date().setDate(this.getMondayWeek().getDate() + i));
    }
    return allDayWeek;
  }

  storeDateOfCMonth() {
    let allDayMonth = [];

    // To calculate the time difference of two dates 
    var Difference_In_Time = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0).getTime() - new Date(this.today.getFullYear(), this.today.getMonth(), 1).getTime();

    // To calculate the no. of days between two dates 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


    for (let i = 0; i <= Difference_In_Days; i++) {
      allDayMonth.push(new Date().setDate((this.today.getFullYear(), this.today.getMonth(), 1) + i));
    }
    return allDayMonth;

  }

  storeDayOf2Date(start, end) {
    let days = [];

    // To calculate the time difference of two dates 
    var Difference_In_Time = new Date(end).getTime() - new Date(start).getTime();

    // To calculate the no. of days between two dates 
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);


    if (Difference_In_Days == 0) {

      days.push(Math.round(new Date(start).getTime() / 1000));
    }
    else {
      for (let i = 0; i <= Difference_In_Days; i++) {
        days.push(new Date().setDate(start.getDate() + i));
      }
    }

    return days;

  }


  settings: CupertinoSettings = {
    onDidDismiss: (e) => {
      if (e) {
        this.showBackdrop = false;
        this.dateModalDisplay = !this.dateModalDisplay;
        this.myPane.hide();
        this.myPane.destroy();
      }
    }
  };

  settings2: CupertinoSettings = {
    onDidDismiss: (e) => {
      if (e) {
        this.showBackdrop = false;
        this.sdateModalDisplay = !this.sdateModalDisplay;
        this.sDatePane.hide();
        this.sDatePane.destroy();
      }
    }
  };

  constructor(
    public actionSheetController: ActionSheetController,
    public modalController: ModalController,
    private datePipe: DatePipe,
    private rService: ReportService,
    private datePicker: DatePicker,
    private authService: AuthenticationService,
    private socket: Socket,
    private file: File,
    private fileOpener: FileOpener,
    private socialSharing: SocialSharing



  ) { }

  ngOnInit() {

  }

  async sDateModal() {

    this.dateModalDisplay = !this.dateModalDisplay;
    this.showBackdrop = !this.showBackdrop

    if (this.dateModalDisplay || this.myPane.isHidden()) {
      this.myPane.present({ animate: true });
      this.myPane.setBreakpoints({
        top: {
          enabled: false,
        },
        middle: { enabled: true, height: 500, bounce: true },
        bottom: { enabled: false, height: 0 }
      });
    } else {
      this.myPane.hide()
    }

  }

  async sDPartModal() {

    this.sdateModalDisplay = !this.sdateModalDisplay;
    this.showBackdrop = true;

    if (this.sdateModalDisplay || this.sDatePane.isHidden()) {
      this.sDatePane.present({ animate: true });
      this.sDatePane.setBreakpoints({
        top: {
          enabled: false,
        },
        middle: { enabled: true, height: 400, bounce: true },
        bottom: { enabled: false, height: 0 }
      });
    } else {
      this.sDatePane.hide()
    }

  }

  ionViewWillEnter() {
    this.grantAccess()
    this.showBackdrop = false;
    this.dateModalDisplay = false;
    this.myPane = new CupertinoPane('.sDate-pane', this.settings);
    this.sDatePane = new CupertinoPane('.sDateParticular', this.settings2);

    //this.myPane.preventDismiss(true);

  }

  grantAccess() {

    const user = this.authService.getUser();
    if (user) {
      this.socket.emit('user-profile', user.email);
      this.getUserProfile(user.email).subscribe(user => {
        this.c_user = [];
        this.c_user.push(user['user']);
        this.user = user['user'];
        if (user['user'].function == "Distribution") {
          this.nId = user['user']['_id'];
          this.addOrderAccess = false;
        }
        if (user['user'].function == "CEO") {
          this.addOrderAccess = true;
        }
      });
    }
  }

  getUserProfile(email) {
    let observable = new Observable(observer => {
      this.socket.on(`get-user-profile-${email}`, (data) => {
        observer.next(data);
      });
    })
    return observable;
  }

  ionViewDidLeave() {
    this.dateModalDisplay = !this.dateModalDisplay;
    this.myPane.hide();
    this.myPane.destroy();

    this.sdateModalDisplay = !this.sdateModalDisplay;
    this.sDatePane.hide();
    this.sDatePane.destroy();
    //this.DisplayReport = false;

  }


  generate(date: String) {

    if (this.sDateRadio == 'today') {
      this.rService.getReportTo_Ye(this.today, this.nId);
      this.storeReport();
      this.DisplayReport = true;
    }
    if (this.sDateRadio == 'yesterday') {
      this.rService.getReportTo_Ye(this.yesterday, this.nId);
      this.storeReport();
      this.DisplayReport = true;


    }
    if (this.sDateRadio == 'week') {
      this.DisplayReport = true;
      this.storeReport();
      this.rService.getReportofDates(this.storeDayOfCWeek(), this.nId);

    }
    if (this.sDateRadio == 'month') {
      this.DisplayReport = true;
      this.storeReport();
      this.rService.getReportofDates(this.storeDateOfCMonth(), this.nId);

    }
    if (this.sDateRadio == 'particular') {
      this.DisplayReport = true;
      if (this.storeDayOf2Date(this.range.get('start').value, this.range.get('end').value).length == 1) {

        this.rService.getReportOneDate(this.range.get('start').value, this.nId);
        this.storeReport();
      }
      if (this.storeDayOf2Date(this.range.get('start').value, this.range.get('end').value).length > 1) {
        this.rService.getReportofDates(this.storeDayOf2Date(this.range.get('start').value, this.range.get('end').value), this.nId);
        this.storeReport();

      }

    }

  }


  storeReport() {
    this.rSubscription = this.rService.reportSubject.subscribe(
      (reports: Report[]) => {
        this.reports = reports;
      }
    );
    this.rService.emitReport();

  }

  confirmDateRange() {
    this.sDatePane.hide();
    this.sdateModalDisplay = !this.sdateModalDisplay;
    this.showBackdrop = false;

    //firstdate
    var fInterDate = new Date(this.range.get('start').value);
    var ddf = String(fInterDate.getDate()).padStart(2, '0');
    var mmf = String(fInterDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyyf = fInterDate.getFullYear();

    var lInterDate = new Date(this.range.get('end').value);
    var ddl = String(lInterDate.getDate()).padStart(2, '0');
    var mml = String(lInterDate.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyyl = lInterDate.getFullYear();

    this.sDateFrench = `${ddf}/${mmf}` + ' - ' + `${ddl}/${mml}`;

  }

  selectDay() {
    this.sDateFrench = `Aujourd'hui`;
    this.sDateRadio = 'today';
    this.myPane.hide();
    this.dateModalDisplay = !this.dateModalDisplay;
    this.showBackdrop = !this.showBackdrop
  }

  selectYesterday() {
    this.sDateRadio = 'yesterday'
    this.sDateFrench = `Hier`;
    this.myPane.hide();
    this.dateModalDisplay = !this.dateModalDisplay;
    this.showBackdrop = !this.showBackdrop
  }

  selectWeek() {
    this.sDateFrench = `Cette Semaine`;
    this.sDateRadio = 'week'
    this.myPane.hide();
    this.dateModalDisplay = !this.dateModalDisplay;
    this.showBackdrop = !this.showBackdrop
  }

  selectMonth() {
    this.sDateFrench = `Ce mois`;
    this.sDateRadio = 'month'
    this.myPane.hide();
    this.dateModalDisplay = !this.dateModalDisplay;
    this.showBackdrop = !this.showBackdrop
  }

  selectParticular() {
    this.sDateFrench = `Personnalisé`;
    this.sDateRadio = 'particular'
    this.sDPartModal()
    this.myPane.hide();
    this.dateModalDisplay = !this.dateModalDisplay;
    //this.showBackdrop = !this.showBackdrop
  }


  async selectLivreur() {
    const modal = await this.modalController.create({
      component: SLivreurPage,
      componentProps: {
        'id': this.nId,
      }
    });

    modal.onDidDismiss()
      .then((data) => {
        const user = data['data'];
        this.nLivreur = data['data']['nom'];
        this.nId = data['data']['id'];
      });

    return await modal.present();
  }
 
  generatePdf() {
    //this.presentLoading('Creating PDF file...');
    const div = document.getElementById("reportpdf");
    const options = { background: 'white', height: 845, width: 595 };
    domtoimage.toPng(div, options).then((dataUrl) => {
      //Initialize JSPDF
      var doc = new jspdf.jsPDF("p", "mm", "a4");
      //Add image Url to PDF
      doc.addImage(dataUrl, 'PNG',  0, 0, 250, 250);



      let pdfOutput = doc.output();
      // using ArrayBuffer will allow you to put image inside PDF
      let buffer = new ArrayBuffer(pdfOutput.length);
      let array = new Uint8Array(buffer);
      for (var i = 0; i < pdfOutput.length; i++) {
        array[i] = pdfOutput.charCodeAt(i);
      }


      //This is where the PDF file will stored , you can change it as you like
      // for more information please visit https://ionicframework.com/docs/native/file/
      const directory = this.file.dataDirectory;
      const fileName = 'rapports-'+ this.reports[0]+'-.pdf';
      let options: IWriteOptions = { replace: true };

      this.file.checkFile(directory, fileName).then((success) => {
        //Writing File to Device
        this.file.writeFile(directory, fileName, buffer, options)
          .then((success) => {
            //this.loading.dismiss();
            console.log("File created Succesfully" + JSON.stringify(success));
            this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
              .then(() => console.log('File is opened'))
              .catch(e => console.log('Error opening file', e));
          })
          .catch((error) => {
            //this.loading.dismiss();
            console.log("Cannot Create File " + JSON.stringify(error));
          });
      })
        .catch((error) => {
          //Writing File to Device
          this.file.writeFile(directory, fileName, buffer)
            .then((success) => {
              //this.loading.dismiss();
              console.log("File created Succesfully" + JSON.stringify(success));
              this.fileOpener.open(this.file.dataDirectory + fileName, 'application/pdf')
                .then(() => console.log('File is opened'))
                .catch(e => console.log('Error opening file', e));
            })
            .catch((error) => {
              //this.loading.dismiss();
              console.log("Cannot Create File " + JSON.stringify(error));
            });
        });
    })
      .catch(function (error) {
        //this.loading.dismiss();
        console.error('oops, something went wrong!', error);
      });
  }


  shareReport() {
    let report = '';

    let qty ='';

    for(let i =0; i<this.reports[1].length; i++){
      let product = '';
      for(let j =0; j<this.reports[1][i].commande.length; j++){
        product += `${this.reports[1][i].commande[j].qty}x${this.reports[1][i].commande[j].product},`    
      }
      report += `${i+1}-${this.reports[1][i].name}: ${this.reports[1][i].phone} - ${product}\n`    
    }

    for(let i =0; i<this.reports[2].length; i++){
      qty += `(${this.reports[2][i].qty})${this.reports[2][i].product}, `    
    }

    let msg = 
`#Rapports des Ventes ${this.reports[0]}

${report}
Qtité : ${qty}

Montant : *${this.devise} ${this.reports[3]}*

Auteur: ${this.reports[4]}`;


    this.socialSharing.shareViaWhatsApp(msg).then((res) => {
      console.log('sharing');
    }).catch((e) => {
      // Error!
    });

  }


}
