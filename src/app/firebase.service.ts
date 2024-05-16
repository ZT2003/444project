//@ts-nocheck
import { Injectable } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendSignInLinkToEmail } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { collection, collectionData, CollectionReference, DocumentReference } from '@angular/fire/firestore';
import { getDocs, doc, deleteDoc, updateDoc, docData, setDoc, addDoc, query } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DocumentData } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(public auth:Auth, public fs: Firestore, public router: Router) {
    this.userCollection = collection(this.fs, 'Users');
    this.ideaCollection = collection(this.fs, 'Ideas');
    this.articleCollection = collection(this.fs, 'Articles');
    this.bookCollection = collection(this.fs, 'Books');

    this.getUsers();
    this.getIdeas();
    this.getArticles();
    this.getBooks();
  }

  user: User;
  public users: any[] = [];
  public users$: Observable<User[]>;
  userCollection: CollectionReference<DocumentData>;

  idea: Idea;
  public ideas: any[] = [];
  public ideas$: Observable<Idea[]>;
  ideaCollection: CollectionReference<DocumentData>;

  article: Article;
  public articles: any[] = [];
  public articles$: Observable<Article[]>
  articleCollection: CollectionReference<DocumentData>;

  book: Book;
  public books: any[] = [];
  public books$: Observable<Book[]>;
  bookCollection: CollectionReference<DocumentData>;

  async getUsers(){
    this.users$ = collectionData(query(this.userCollection), {idField: 'id'}) as Observable<User[]>;
  }
  async getIdeas(){
    this.ideas$ = collectionData(query(this.ideaCollection), {idField: 'id'}) as Observable<Idea[]>;
  }
  async getArticles(){
    this.articles$ = collectionData(query(this.articleCollection), {idField: 'id'}) as Observable<Article[]>;
  }
  async getBooks(){
    this.books$ = collectionData(query(this.bookCollection), {idField: 'id'}) as Observable<Book[]>;
  }
  addUser(u): Promise<DocumentReference>{
    return addDoc(this.userCollection, u);
  }
  addIdea(i): Promise<DocumentReference>{
    return addDoc(this.ideaCollection, i);
  }
  addArticle(a): Promise<DocumentReference>{
    return addDoc(this.articleCollection, a);
  }
  addBook(b): Promise<DocumentReference>{
    return addDoc(this.bookCollection, b);
  }
  editUser(u:User): Promise<DocumentReference>{
    return updateDoc(doc(this.fs, `Users/${u.id}`), {usernaem: u.username, email: u.email});
  }
  editIdea(i:Idea): Promise<DocumentReference>{
    return updateDoc(doc(this.fs, `Ideas/${i.id}`), {title: i.title, topic: i.topic, date: new Date(), summary: i.summary, images: i.images});
  }
  editArticle(a:Article): Promise<DocumentReference>{
    return updateDoc(doc(this.fs, `Articles/${a.id}`), {title: a.title, topic: a.topic, date: new Date(), summary: a.summary, imgaes: a.images});
  }
  editBook(b:Book): Promise<DocumentReference>{
    return updateDoc(doc(this.fss, `Books/${b.id}`), {title: b.title, topic: b.topic, date: new Date(), chapters: b.chapters});
  }
  deleteUser(u:User): Promise<void>{
    return deleteDoc(doc(this.fs, 'Users', u.id));
  }
  deleteIdea(i:Idea): Promise<void>{
    return deleteDoc(doc(this.fs, 'Ideas', i.id));
  }
  deleteArticle(a:Article): Promise<void>{
    return deleteDoc(doc(this.fs, 'Articles', a.id));
  }
  deleteBook(b:Book): Promise<void>{
    return deleteDoc(doc(this.fs, 'Books', b.id));
  }

  const auth = getAuth();

  signup(un, em, ps){
    createUserWithEmailAndPassword(this.auth, em, ps)
    .then(() => {
      this.user = {username: un, email: em, read: [], favorite: []};
      this.addUser(this.user);
      this.router.navigateByUrl('/login');
      alert("signup successful");
    })
    .catch(() => {
      alert("signup failled");
    });
  }
  login(em, ps){
    signInWithEmailAndPassword(this.auth, em, ps)
    .then(() => {
      this.router.navigateByUrl('/home');
      alert("success login");
    })
    .catch(() => {
      alert("failled login");
    });
  }
}
export interface Idea {
  id: string,
  title: string,
  topic: string[],
  date: Date,
  summary: string,
  images: string[],
  comments: {comment: string, user: string}[],
  ratings: {rating: number, user: string}[]
}

export interface Article {
  id: string,
  title: string,
  topic: string[],
  date: Date,
  summary: string,
  images: string[],
  comments: {comment: string, user: string}[],
  ratings: {rating: number, user: string}[]
}

export interface Book {
  id: string,
  type: string,
  title: string,
  topic: string[],
  date: Date,
  summary?: string,
  writer: string,
  chapters?: {chapter: number, summary: string, images: string[]}[],
  comments?: {comment: string, user: string}[],
  ratings?: {rating: number, user: string}[]
}

export interface User {
  id?: string,
  username: string,
  email: string,
  read?: string[],
  favorite?: string[]
}