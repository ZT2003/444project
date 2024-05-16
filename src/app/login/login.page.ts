//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendSignInLinkToEmail } from '@angular/fire/auth';
import { FirebaseService } from '../firebase.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public auth: Auth, public fb: FirebaseService) { }

  ngOnInit() {
  }

  email: string = "";
  password: string = "";

  const auth = getAuth();
  login(){
    this.fb.login(this.email, this.password);
  }

}
