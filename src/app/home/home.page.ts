//@ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { FirebaseService, Summary } from '../firebase.service';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  summary: Summary;
  email;

  constructor(public fb: FirebaseService, public modal: ModalController, public storage: Storage, public router: Router) { }

  ngOnInit() {
    this.email = this.fb.email;
    this.summary = {writer: this.email, date: new Date()};
  }

  
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.summary, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.fb.addSummary(this.summary);
      this.summary = {writer: this.email, date: new Date()};
    }
  }

  showBook = false;
  type(){
    if(this.summary.type == 'book'){
      this.showBook = true;
      this.summary.chapters = [{chapter: null, summary: ""}, ];
    }
    else
      this.showBook = false;
  }

  addChapter(){
    this.summary.chapters.push({chapter: null, summary: ""});
    this.remove = false;
  }
  remove = true;
  removeChapter(i){
    this.summary.chapters.splice(i,1);
    if(this.summary.chapters.length == 1)
      this.remove = true;
  }
  
}
