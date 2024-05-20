//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FirebaseService, Summary } from '../firebase.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  constructor(public fb: FirebaseService, public activatedRoute: ActivatedRoute) { }
  i: number;
  summary;
  ngOnInit() {
    this.i = Number(this.activatedRoute.snapshot.paramMap.get('index'));
    this.fb.summaries$.subscribe((data) => {this.summary = data;});
  }

  comment;
  addComment(){
    this.fb.addComment(this.summary.id, this.comment);
  }

}
