//@ts-nocheck
import { Injectable } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendSignInLinkToEmail, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { getDocs, doc, deleteDoc, updateDoc, docData, setDoc, addDoc, query, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DocumentData, where } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  userCollection: CollectionReference<DocumentData>;
  summaryCollection: CollectionReference<DocumentData>;
  combinedDraftsCollection: CollectionReference<DocumentData>;
  favoritesCollection: CollectionReference<DocumentData>;
  commentsCollection: CollectionReference<DocumentData>;
  ratingsCollection: CollectionReference<DocumentData>;

  constructor(
    public auth: Auth,
    public fs: Firestore,
    public router: Router,
    public alertCtrl: AlertController
  ) {
    this.userCollection = collection(this.fs, 'Users');
    this.summaryCollection = collection(this.fs, 'Summaries');
    this.draftsCollection = collection(this.fs, 'drafts');
    this.favoritesCollection = collection(this.fs, 'favorites');
    this.commentsCollection = collection(this.fs, 'comments');
    this.ratingsCollection = collection(this.fs, 'ratings');

    this.getUsers();
    this.getSummaries();
    this.getSummariesCopy();
    this.user$ = new Observable((observer) => {
      onAuthStateChanged(this.auth, (user) => {
        if (user) {
          this.email = user.email;
        } else {
          this.email = 'default value';
          console.log('else: ' + this.email);
          observer.next(null);
        }
      });
    });
  }

  email = 'default value';

  user: User;
  public users: any[] = [];
  public users$: Observable<User[]>;

  summary: Summary;
  public summaries: any[] = [];
  public summaries$: Observable<Summary[]>;

  async getUsers() {
    this.users$ = collectionData(query(this.userCollection), {
      idField: 'id',
    }) as Observable<User[]>;
  }

  getSummariesByOthers(): Observable<Summary[]> {
    const queryRef = query(
      this.summaryCollection,
      where('writer', '!=', this.email)
    );
    return collectionData(queryRef, { idField: 'id' }) as Observable<Summary[]>;
  }

  async getSummaries() {
    this.summaries$ = collectionData(query(this.summaryCollection), {
      idField: 'id',
    }) as Observable<Summary[]>;
  }

  async getSummariesCopy() {
    const querySnapshot = await getDocs(this.summaryCollection);
    querySnapshot.forEach((doc) => {
      this.summaries.push(doc.data());
    });
  }

  addUser(u): Promise<DocumentReference> {
    return addDoc(this.userCollection, {
      ...u,
      favorites: [],
    });
  }

  addDraft(draft: Summary, type: string) {
    const draftWithTypeInfo = { ...draft, type };
    const draftsCollection = collection(this.fs, 'drafts');
    return addDoc(draftsCollection, draftWithTypeInfo);
  }

  addFavorite(summary: Summary): Promise<DocumentReference> {
    return addDoc(this.favoritesCollection, summary);
  }

  async getFavorites(): Promise<Summary[]> {
    try {
      const favoritesCollection = collection(this.fs, 'favorites');
      const querySnapshot = await getDocs(favoritesCollection);
      const favorites: Summary[] = [];
      querySnapshot.forEach((doc) => {
        favorites.push({
          id: doc.id,
          date: doc.data().date,
          summary: doc.data().summary,
          title: doc.data().title,
          topic: doc.data().topic,
          type: doc.data().type,
          writer: doc.data().writer,
        });
      });
      return favorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  async getFavoritesByType(type: string): Promise<Summary[]> {
    return new Promise<Summary[]>((resolve) => {
      this.user$.subscribe((user) => {
        if (user) {
          this.getUserData(user.email).then((userData) => {
            const favorites = userData.favorites || [];
            const favoritesByType = favorites.filter(
              (favorite: Summary) => favorite.type === type
            );
            resolve(favoritesByType);
          });
        } else {
          resolve([]);
        }
      });
    });
  }

  async removeFavorite(favoriteId: string) {
    const userRef = doc(this.fs, 'Users', this.email);
    return updateDoc(userRef, {
      favorites: arrayRemove(favoriteId),
    });
  }

  getUser(userId: string) {
    return this.fs.collection('users').doc(userId).valueChanges();
  }

  addSummary(s): Promise<DocumentReference> {
    return addDoc(this.summaryCollection, s);
  }

  editUser(u: User): Promise<void> {
    return updateDoc(doc(this.fs, `Users/${u.id}`), {
      username: u.username,
      email: u.email,
    });
  }

  editSummary(s: Summary): Promise<void> {
    return updateDoc(doc(this.fs, `Summaries/${s.id}`), {
      type: s.type,
      title: s.title,
      topic: s.topic,
      date: new Date(),
      summary: s.summary,
      chapters: s.chapters,
    });
  }

  generateId(): string {
    return doc(collection(this.fs, '_')).id;
  }
  async addComment(
    summaryId: string,
    comment: string,
    user: string
  ): Promise<void> {
    try {
      const commentsCollection = collection(
        this.fs,
        `Summaries/${summaryId}/comments`
      );
      await addDoc(commentsCollection, { comment, user });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async addRating(
    summaryId: string,
    rating: number,
    user: string
  ): Promise<void> {
    try {
      const ratingsCollection = collection(
        this.fs,
        `Summaries/${summaryId}/ratings`
      );
      await addDoc(ratingsCollection, { rating, user });
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }

  async getNumComments(summaryId: string): Promise<number> {
    try {
      const commentsCollection = collection(
        this.fs,
        `Summaries/${summaryId}/comments`
      );
      const querySnapshot = await getDocs(commentsCollection);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error fetching number of comments:', error);
      throw error;
    }
  }

  async getNumRatings(summaryId: string): Promise<number> {
    try {
      const ratingsCollection = collection(
        this.fs,
        `Summaries/${summaryId}/ratings`
      );
      const querySnapshot = await getDocs(ratingsCollection);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error fetching number of ratings:', error);
      throw error;
    }
  }

  async getComments(summaryId: string): Promise<any[]> {
    try {
      const commentsCollection = collection(
        this.fs,
        `Summaries/${summaryId}/comments`
      );
      const querySnapshot = await getDocs(commentsCollection);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  }

  async getRatings(summaryId: string): Promise<any[]> {
    try {
      const ratingsCollection = collection(
        this.fs,
        `Summaries/${summaryId}/ratings`
      );
      const querySnapshot = await getDocs(ratingsCollection);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error('Error fetching ratings:', error);
      throw error;
    }
  }
 
  deleteUser(u: User): Promise<void> {
    return deleteDoc(doc(this.fs, 'Users', u.id));
  }

  deleteSummary(s: Summary): Promise<void> {
    return deleteDoc(doc(this.fs, 'Summaries', s.id));
  }

  getDrafts(): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      getDocs(this.draftsCollection)
        .then((querySnapshot) => {
          const drafts: any[] = [];
          querySnapshot.forEach((doc) => {
            drafts.push({
              id: doc.id,
              date: doc.data().date,
              summary: doc.data().summary,
              title: doc.data().title,
              writer: doc.data().writer,
            });
          });
          observer.next(drafts);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error fetching drafts:', error);
          observer.error(error);
        });
    });
  }

  updateDraft(draft: Summary): Promise<void> {
    const draftRef = doc(this.fs, 'drafts', draft.id);
    return updateDoc(draftRef, { ...draft });
  }

  auth = getAuth();

  signup(em, ps) {
    createUserWithEmailAndPassword(this.auth, em, ps)
      .then(() => {
        this.user = { email: em, read: [], favorites: [] };
        this.addUser(this.user);
        this.router.navigateByUrl('/login');
      })
      .catch(async () => {
        const alert = await this.alertCtrl.create({
          header:
            'Failed signup, please try again later with a different email',
          buttons: [{ text: 'ok' }],
        });
        await alert.present();
      });
  }

  login(em, ps) {
    signInWithEmailAndPassword(this.auth, em, ps)
      .then(() => {
        this.router.navigateByUrl('/home');
      })
      .catch(async () => {
        const alert = await this.alertCtrl.create({
          header: 'Failed login, wrong email or password',
          buttons: [{ text: 'ok' }],
        });
        await alert.present();
      });
  }

  signout() {
    signOut(this.auth)
      .then(() => {
        this.router.navigateByUrl('/login');
      })
      .catch(async () => {
        const alert = await this.alertCtrl.create({
          header: 'Failed signout, please try again later',
          buttons: [{ text: 'ok' }],
        });
        await alert.present();
      });
  }
}

export interface Summary {
  id: string;
  type: 'idea' | 'article' | 'draft';
  title: string;
  topic: string[];
  date: Date;
  summary: string;
  images: string[];
  writer: string;
  chapters: { chapter: number; summary: string; images: string[] }[];
  ratings?: { rating: number; user: string }[];
  comments?: { comment: string; user: string }[];

  favorites: boolean;
  selected?: boolean;
  selectedOrder?: number;
}

export interface Comment {
  id: string;
  comment: string;
  user: string;
}

export interface User {
  id?: string;
  email: string;
  read?: string[];
  favorites?: string[];
}
