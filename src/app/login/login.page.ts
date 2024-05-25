//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public fb: FirebaseService, public form: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  loginForm: FormGroup;
  createForm(){
    this.loginForm = this.form.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  login(check){
    if(check){
      const { email, password } = this.loginForm.value;
      this.fb.login(email, password);
    }
  }

  passType = "password";
  passIcon = "eye-off"
  showPass(){
    if(this.passType === "password"){
      this.passType = "text";
      this.passIcon = "eye";
    }
    else{
      this.passType = "password";
      this.passIcon = "eye-off";
    }
  }

}
