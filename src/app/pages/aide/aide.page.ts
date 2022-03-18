import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { DatePipe } from '@angular/common';
import { InAppBrowser , InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';



@Component({
  selector: 'app-aide',
  templateUrl: './aide.page.html',
  styleUrls: ['./aide.page.scss'],
})
export class AidePage implements OnInit {

  version : string = GlobalConstants.version;
  appname : string = GlobalConstants.appname;

  currentDate = new Date();

  currentYear = this.datePipe.transform(this.currentDate, 'yyyy');

  constructor(private datePipe: DatePipe,
              private iab: InAppBrowser) { }

  ngOnInit() {
  }



  openUrl(url : string){
    const options : InAppBrowserOptions= {
       zoom : 'no'
    }
    const browser = this.iab.create(url, '_self', options); 
  }

}
