import { Component, OnInit } from '@angular/core';
import { FirebaseService, Summary } from '../firebase.service';

@Component({
  selector: 'app-summary-list-component',
  templateUrl: './summary-list-component.page.html',
  styleUrls: ['./summary-list-component.page.scss'],
})
export class SummaryListComponent implements OnInit {
  otherSummaries: Summary[] = [];
  selectedSummaries: Summary[] = [];

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.firebaseService.getSummariesByOthers().subscribe((summaries) => {
      this.otherSummaries = summaries;
    });
  }

  toggleSelection(summary: Summary) {
    const index = this.selectedSummaries.findIndex((s) => s.id === summary.id);
    if (index === -1) {
      this.selectedSummaries.push(summary);
    } else {
      this.selectedSummaries.splice(index, 1);
    }
  }

  isSelected(summary: Summary): boolean {
    return this.selectedSummaries.some((s) => s.id === summary.id);
  }

  moveUp(index: number) {
    if (index > 0) {
      const temp = this.selectedSummaries[index];
      this.selectedSummaries[index] = this.selectedSummaries[index - 1];
      this.selectedSummaries[index - 1] = temp;
    }
  }

  moveDown(index: number) {
    if (index < this.selectedSummaries.length - 1) {
      const temp = this.selectedSummaries[index];
      this.selectedSummaries[index] = this.selectedSummaries[index + 1];
      this.selectedSummaries[index + 1] = temp;
    }
  }

  createDraft() {
    const draftSummary: Summary = {
      id: '',
      type: 'draft',
      title: 'Draft Summary',
      topic: [],
      date: new Date(),
      summary: '',
      images: [],
      writer: this.firebaseService.email,
      chapters: [],
      comments: [],
      ratings: [],
      favorites: false,
    };

    const summaries = this.selectedSummaries.map((s) => s.summary);
    draftSummary.summary = summaries.join('\n\n');

    this.firebaseService.addSummary(draftSummary);
  }
}
