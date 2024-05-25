import { Component, OnInit } from '@angular/core';
import { FirebaseService, Summary } from '../firebase.service';

@Component({
  selector: 'app-drafts',
  templateUrl: './drafts.page.html',
  styleUrls: ['./drafts.page.scss'],
})
export class DraftsPage implements OnInit {
  combinedDrafts: any[] = [];
  isEditDraftModalOpen = false;
  selectedDraft!: Summary;
  selectedDraftType!: string;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.fetchCombinedDrafts();
  }

  fetchCombinedDrafts() {
    this.firebaseService.getDrafts().subscribe((drafts) => {
      this.combinedDrafts = drafts;
    });
  }

  dismissEditDraftModal() {
    this.isEditDraftModalOpen = false;
  }

  openEditDraftModal(draft: Summary) {
    this.selectedDraft = draft;
    this.isEditDraftModalOpen = true;
  }

  async saveChanges() {
    // Call a method to update the draft in Firebase
    // For example: this.firebaseService.updateDraft(this.selectedDraft);
    this.isEditDraftModalOpen = false; // Close the modal after saving changes
  }
}
