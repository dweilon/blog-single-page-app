import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from '../../private/user/user.model';

import { UserService } from '../../_services/user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private router: Router,
              private authService: AuthService) { }
  
  loginForm: FormGroup;
  usernameFound = false;
  user: User;
  submitted = false;

  ngOnInit() {
    this.loginForm = this.fb.group({
      'username': [null, Validators.required],
      'password': [null, Validators.required]
    }, { validator: this.loginMustValid('username', 'password') });
  }

  onSubmit() {

    console.log(this.loginForm);
    this.submitted = true;
    if (this.loginForm.valid) {
      let username = this.loginForm.value.username;
      let password = this.loginForm.value.password;
      this.authService.loginUser(username, password);
    } else {
      this.loginForm.reset;
      return;
    }
  
  }

  loginMustValid(username: string, password: string) {
    return (formGroup: FormGroup) => {
      const usernameControl = formGroup.controls[username];
      const passwordControl = formGroup.controls[password];

      if (this.userService.getUsernames().indexOf(usernameControl.value) !== -1) {
        this.usernameFound = true;
        this.user = this.userService.getUserByUsername(usernameControl.value);
        usernameControl.setErrors(null);
        if (this.user.password === passwordControl.value) {
          passwordControl.setErrors(null);
        } else {
          passwordControl.setErrors({'passwordIncorrect': true});
        }
      } else {
        usernameControl.setErrors({'userNotFound': true});
        passwordControl.setErrors({'passwordIncorrect': true});
      }      

    }
  }


}
