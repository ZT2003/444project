//@ts-nocheck
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../firebase.service';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  signForm: FormGroup;

  constructor(public fb: FirebaseService, public form: FormBuilder) { }

  ngOnInit() {
    this.createForm();
  }

  createForm(){
    this.signForm = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[0-9a-zA-Z_$#@%*-.]{2,}$'), Validators.maxLength(30)]],
      passwordConfirm: ['', [Validators.required]] 
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    return formGroup.get('password').value === formGroup.get('passwordConfirm').value? null : { mismatch: true };
  }
  
  signup(check){
    if(check){
      const { email, password } = this.signForm.value;
      this.fb.signup(email, password);    
    }
  }

  password1 = "password";
  passIcon1 = "eye-off"
  showPass1(){
    if(this.password1 === "password"){
      this.password1 = "text";
      this.passIcon1 = "eye";
    }
    else{
      this.password1 = "password";
      this.passIcon1 = "eye-off";
    }
  }

  password2 = "password";
  passIcon2 = "eye-off"
  showPass2(){
    if(this.password2 === "password"){
      this.password2 = "text";
      this.passIcon2 = "eye";
    }
    else{
      this.password2 = "password";
      this.passIcon2 = "eye-off";
    }
  }

}
