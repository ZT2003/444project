//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FirebaseService, Book } from '../firebase.service';
import { IonModal, ModalController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public fb: FirebaseService, public modal: ModalController) { }

  ngOnInit() {
  }

  book: Book = {};
  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.book, 'confirm');
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.fb.addBook(this.book);
    }
  }
}
