import { StorageService } from './../../../core/services/storage.service';
import { UserService } from './../../../core/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from './../../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private storageService: StorageService,
    private userService: UserService,
    private snackbar: MatSnackBar
  ) {}

  signUpForm = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
    password1: new FormControl('', [
      Validators.minLength(6),
      Validators.required,
    ]),
  });
  loading = false;
  hide = true;

  onSignup() {
    const that = this;
    that.loading = true;
    if (
      that.signUpForm.valid &&
      that.signUpForm.value.password === that.signUpForm.value.password1
    ) {
      const userName = that.signUpForm.value.username;
      const password = that.signUpForm.value.password;
      that.authService.signup(userName, password).subscribe(
        (resp) => {
          that.snackbar.open(resp.message);
          that.authService.login(userName, password).subscribe((res) => {
            that.authService.store(res);
            that.userService.getUser().subscribe((user) => {
              that.storageService.set('user', user);
              this.router.navigate(['/']);
            });
          });
        },
        (error) => {
          that.loading = false;
          that.snackbar.open(error.statusText);
        }
      );
      that.signUpForm.reset();
    }
    that.loading = false;
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }
}
