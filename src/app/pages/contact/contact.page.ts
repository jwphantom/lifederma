import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {


  currentImage = null;

  content : string = "";

  sendMailOk : Boolean = true;

  constructor(private camera: Camera, private emailComposer: EmailComposer) { }
 
  ngOnInit() {

    
  }

  captureImage() {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
    }

    this.camera.getPicture(options).then((imageData) => {
      this.currentImage = imageData;
    }, (err) => {
      // Handle error
      console.log('Image error: ', err);
    });
  }

  sendEmail() {

    let email = {
      to: 'sudogen.enterprise@gmail.com',
      cc: 'jawill.olongo@gmail.com',
      attachments: [
        this.currentImage
      ],
      subject: 'Contact - Us',
      body: this.content,
      isHtml: true
    };

    this.emailComposer.open(email);
  }

  contentArea(ev : CustomEvent){

    const val = ev.detail.value;
    //console.log(val);

    if(val.length > 9){
      this.sendMailOk = false;
    }
    else{
      this.sendMailOk = true;
    }
  }

}
