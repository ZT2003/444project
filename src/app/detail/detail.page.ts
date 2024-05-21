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
  i: number;
  summary;
  newComment: string = '';
  newRating: number = 1;

  constructor(public fb: FirebaseService, public activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.i = Number(this.activatedRoute.snapshot.paramMap.get('index'));
    this.fb.summaries$.subscribe((data) => {
      this.summary = data;
    });
  }

    addCommentAndRating() {
      this.fb.addComment(this.summary[this.i].id, {
        comment: this.newComment,
        user: this.fb.email
      }).then(() => {
        this.newComment = '';
      });
    
      this.fb.addRating(this.summary[this.i].id, {
        rating: this.newRating,
        user: this.fb.email
      }).then(() => {
        this.newRating = 1;
      });
    }
    }
    
  