//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendSignInLinkToEmail } from '@angular/fire/auth';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  constructor(public auth: Auth, public fb: FirebaseService) { }

  ngOnInit() {
  }

  email: string = "";
  password: string = "";
  passwordConfirm: string = "";
  username: string = "";

  const auth = getAuth();

  signup(){
    this.fb.signup(this.username, this.email, this.password);
  }

}
