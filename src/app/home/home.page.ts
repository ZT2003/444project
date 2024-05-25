//@ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { FirebaseService, Summary } from '../firebase.service';
import { AlertController, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  summary: Summary;
  summaries: Summary[] = []; 
  filteredSummaries: Summary[] = [];
  searchTerm: string = '';
  filterOption: string = 'all';
  
  constructor(public fb: FirebaseService, public modal: ModalController, public router: Router, public  alertCtrl: AlertController) { }

  ngOnInit() {
    this.summary = {writer: this.fb.email, date: new Date()};

    this.fb.summaries$.subscribe((summaries) => {
      this.summaries = summaries; 
      this.filterItems(); 
    });
  }

  filterItems() {
    this.filteredSummaries = this.summaries.filter(summary => {
      
      if (this.filterOption !== 'all' && summary.type !== this.filterOption) {
        return false;
      }
    
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const searchTermLC = this.searchTerm.toLowerCase();
        if (
          !summary.title.toLowerCase().includes(searchTermLC) &&
          !summary.topic.toLowerCase().includes(searchTermLC)
        ) {
          return false;
        }
      }
      return true;
    });
  }
  
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  
  async confirm() {
    const alert = await this.alertCtrl.create({
        header: "Please make sure to fill all input fields",
        buttons: [
          {text:"Ok"}
        ]
      });
    if(this.summary.type != undefined && this.summary.title != undefined && this.summary.topic != undefined){
      let flag = true;
      if(this.summary.type === 'book'){
        for(let i = 0; i < this.summary.chapters.length; ++i){
          if(this.summary.chapters[i].chapter == null || this.summary.chapters[i].summary == "")
            flag = false;
        }
        if(flag)
          this.modal.dismiss(this.summary, 'confirm');
        else
          await alert.present();
      }
      else if(this.summary.summary != undefined)
        this.modal.dismiss(this.summary, 'confirm');      
      else
        await alert.present();
    }
    else
      await alert.present();
      
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.fb.addSummary(this.summary);
      this.summary = {writer: this.fb.email, date: new Date()};
    }
  }

  showBook = false;
  type(){
    if(this.summary.type == 'book'){
      this.showBook = true;
      this.summary.chapters = [{chapter: null, summary: "", image: ""}, ];
    }
    else {
      this.showBook = false;
    }
  }

  addChapter(){
    this.summary.chapters.push({chapter: null, summary: "", image: ""});
    this.remove = false;
  }
  remove = true;
  removeChapter(i){
    this.summary.chapters.splice(i,1);
    if(this.summary.chapters.length == 1)
      this.remove = true;
  }
  
  pictures = [{url: "/assets/pictures/pic1.jpg", text: "engineers at work"},
               {url: "/assets/pictures/pic2.jpg", text: "a map"}, 
               {url: "/assets/pictures/pic3.jpg", text: "an engineer working"},
               {url: "/assets/pictures/pic4.jpg", text: "a girl studying"},
               {url: "/assets/pictures/pic5.jpg", text: "studying in a libarary"},
               {url: "/assets/pictures/pic7.jpg", text: "reading in a libarary"},
               {url: "/assets/pictures/pic9.jpg", text: "desktop computer"},
               {url: "/assets/pictures/pic10.jpg", text: "a cat infront of a computer"}, 
               {url: "/assets/pictures/pic11.jpg", text: "a messy table"},
               {url: "/assets/pictures/pic13.jpg", text: "a coffee  mug"},
               {url: "/assets/pictures/pic14.jpg", text: "boy studying"},
               {url: "/assets/pictures/pic15.jpg", text: "a girl writing"},
               {url: "/assets/pictures/pic16.jpg", text: "a girl in a class room"},
               {url: "/assets/pictures/pic17.jpg", text: "an architecutre studio"},
               {url: "/assets/pictures/pic18.jpg", text: "math study"},
               {url: "/assets/pictures/pic20.jpg", text: "late night work"},
               {url:"/assets/pictures/pic21.jpg", text: "doing homework"},
               {url: "/assets/pictures/pic23.jpg", text: "a plane designer"}];
}
