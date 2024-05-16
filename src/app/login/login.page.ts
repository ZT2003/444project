//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendSignInLinkToEmail } from '@angular/fire/auth';
    

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public auth: Auth) { }

  ngOnInit() {
  }

  email: string = "";
  password: string = "";

  const auth = getAuth();
  login(){
    signInWithEmailAndPassword(this.auth, this.email, this.password).then((res) => {alert("success login");}).catch(() => {alert("failled login");});
  }

}
