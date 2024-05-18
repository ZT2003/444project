//@ts-nocheck
import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { FirebaseService, Summary } from '../firebase.service';
import { ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { Storage, ref, uploadBytesResumable, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('upload') files: ElementRef;
  constructor(public fb: FirebaseService, public modal: ModalController, public storage: Storage) { }

  ngOnInit() {
  }

  summary: Summary = {writer: this.fb.email};
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.summary, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.uploadFile(this.files.nativeElement).then(() => {this.fb.addSummary(this.summary);});
      this.summary = {writer: this.fb.email};
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
    this.summary.chapters.push({chapter: null, summary: ""})
  }

  
  uploadFile(input: HTMLInputElement) {
    if (!input.files) return
    // how about we try the getBytes method, and just save the reference or path in the images array? 
    const files: FileList = input.files;
    for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file) {
            const storageRef = ref(this.storage, file.name);
            uploadBytesResumable(storageRef, file)
            .then(getDownloadURL(storageRef).then((url) => {this.summary.images.push(url);}).catch(() => {alert("can't get url")})).catch(() => alert("cant upload"));
            
        }
    }
  }
  
}
