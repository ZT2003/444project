//@ts-nocheck

import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {
  id: string;
  summary: any = {};
  email: string;
  book: boolean;
  newComment: string;
  rating: number;
  isCommentModalOpen = false;
  numRatings: number;
  numComments: number;

  constructor(
    public fb: FirebaseService,
    public activatedRoute: ActivatedRoute,
    public fs: Firestore
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.getSummary(this.id);
    }
    this.email = this.fb.email;
  }

  async getSummary(id: string) {
    const summaryDocRef = doc(this.fs, `Summaries/${id}`);
    const summarySnapshot = await getDoc(summaryDocRef);
    if (summarySnapshot.exists()) {
      this.summary = summarySnapshot.data();
      this.book = this.summary.type === 'book';
      this.summary.date = new Date(
        this.summary.date.seconds * 1000
      ).toDateString();
      this.numRatings = await this.fb.getNumRatings(id);
      this.numComments = await this.fb.getNumComments(id);
      this.summary.comments = await this.fb.getComments(id);
      this.summary.ratings = await this.fb.getRatings(id);
    } else {
      console.error('Summary not found');
    }
  }

  openCommentModal() {
    this.isCommentModalOpen = true;
  }

  closeCommentModal() {
    this.isCommentModalOpen = false;
  }

  addToFavorites(summary: Summary) {
    this.fb
      .addFavorite(summary)
      .then(() => console.log('Added to favorites'))
      .catch((error) => console.error('Error adding to favorites:', error));
  }

  addComment() {
    if (!this.newComment || this.rating < 1 || this.rating > 5) {
      return;
    }
    this.fb
      .addComment(this.id, this.newComment, this.email)
      .then(() => {
        this.numComments++;
        this.summary.comments.push({
          comment: this.newComment,
          user: this.email,
        });
        this.newComment = '';
      })
      .catch((error) => console.error('Error adding comment:', error));
    this.fb
      .addRating(this.id, this.rating, this.email)
      .then(() => {
        this.numRatings++;
        this.summary.ratings.push({ rating: this.rating, user: this.email });
      })
      .catch((error) => console.error('Error adding rating:', error));
    this.isCommentModalOpen = false;
  }
}
