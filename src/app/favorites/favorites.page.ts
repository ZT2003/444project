import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Summary, FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
})
export class FavoritesPage implements OnInit {
  favorites: Summary[] = [];

  constructor(public fs: FirebaseService) {}

  ngOnInit() {
    this.getFavorites();
  }

  getFavorites() {
    this.fs
      .getFavorites()
      .then((favorites) => {
        this.favorites = favorites;
      })
      .catch((error) => {
        console.error('Error fetching favorites:', error);
        // Handle error appropriately (e.g., show an error message)
      });
  }
  async removeFavorite(favoriteId: string) {
    await this.fs.removeFavorite(favoriteId);
    this.getFavorites(); // Refresh favorites after removing one
  }
}
