//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FirebaseService, Summary } from '../firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Firestore, getDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  constructor(public fb: FirebaseService, public activatedRoute: ActivatedRoute, public fs: Firestore) { }
  id;
  summary: Summary;
  email;
  book;
  ngOnInit() {
    this.summary = [];
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.getS(this.id);
    this.email = this.fb.email;
  }
  async getS(id){
    const querySnapshot = await getDoc(doc(this.fs, `Summaries/${id}`));
    if(querySnapshot.exists()){
      this.summary = querySnapshot.data();
      this.book = this.summary.type === "book";
      this.summary.date = this.summary.date.toDate().toDateString();
    }
  }
}
